package expo.modules

import org.gradle.api.Plugin
import org.gradle.api.Project

class ExpoModuleGradlePlugin implements Plugin<Project> {
  @Override
  void apply(Project project) {
    def rootDir = project.rootProject.projectDir
    def script = new File(rootDir, "../node_modules/expo-modules-core/android/ExpoModulesCorePlugin.gradle")
    if (!script.exists()) {
      throw new IllegalStateException("ExpoModulesCorePlugin.gradle not found at: " + script.absolutePath)
    }
    project.apply([from: script])
    // Provide a minimal 'expoModule' extension to satisfy module build scripts
    project.extensions.create('expoModule', ExpoModuleExtension)

    // Apply Kotlin expo core first to ensure helpers like safeExtGet exist
    if (project.ext.has('applyKotlinExpoModulesCorePlugin')) {
      project.ext.applyKotlinExpoModulesCorePlugin.call()
    }

    def configureLibrary = {
      if (project.ext.has('useDefaultAndroidSdkVersions')) {
        project.ext.useDefaultAndroidSdkVersions.call()
      }
      if (project.ext.has('useCoreDependencies')) {
        project.ext.useCoreDependencies.call()
      }
    }

    def configureApplication = {
      if (project.ext.has('useDefaultAndroidSdkVersions')) {
        project.ext.useDefaultAndroidSdkVersions.call()
      }
    }

    // If plugins already applied, configure immediately
    if (project.plugins.hasPlugin('com.android.library')) {
      configureLibrary.call()
    }
    if (project.plugins.hasPlugin('com.android.application')) {
      configureApplication.call()
    }

    // Also configure when plugins get applied later
    project.plugins.withId('com.android.library') { configureLibrary.call() }
    project.plugins.withId('com.android.application') { configureApplication.call() }
  }
}

class ExpoModuleExtension {
  boolean canBePublished = true
}
