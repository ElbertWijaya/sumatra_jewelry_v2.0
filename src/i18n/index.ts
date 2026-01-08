import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      ongoing: 'Ongoing',
      newOrder: 'New Order',
      notification: 'Notification',
      profile: 'Profile',
      stok: 'Stock',
      newInventory: 'New Inventory',
      selectRole: 'Select Role to Login',
      logout: 'Logout'
    }
  },
  id: {
    translation: {
      home: 'Beranda',
      ongoing: 'Berjalan',
      newOrder: 'Pesanan Baru',
      notification: 'Notifikasi',
      profile: 'Profil',
      stok: 'Stok',
      newInventory: 'Tambah Stok',
      selectRole: 'Pilih Peran untuk Masuk',
      logout: 'Keluar'
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: Localization.locale.startsWith('id') ? 'id' : 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    });
}

export default i18n;
