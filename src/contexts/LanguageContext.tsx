import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh'

export interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
  supportedLanguages: Array<{
    code: SupportedLanguage
    name: string
    nativeName: string
    flag: string
  }>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language configuration
const LANGUAGE_CONFIG = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false }
} as const

// Translation keys and fallback English text
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.pianos': 'Find Pianos',
    'nav.events': 'Events',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Sign Out',
    'nav.admin': 'Admin',
    'nav.moderation': 'Moderation',
    'nav.add': 'Add',
    'nav.addPiano': 'Add Piano',
    'nav.addEvent': 'Add Event',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.share': 'Share',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.location': 'Location',
    'common.category': 'Category',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.description': 'Description',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.all': 'All',
    'common.select': 'Select',
    'common.choose': 'Choose',
    'common.upload': 'Upload',
    'common.optional': 'Optional',
    'common.required': 'Required',
    'common.name': 'Name',
    'common.title': 'Title',
    'common.email': 'Email',
    'common.website': 'Website',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.notes': 'Notes',
    'common.details': 'Details',

    // Form placeholders
    'form.searchPlaceholder': 'Search...',
    'form.emailPlaceholder': 'Enter your email address',
    'form.namePlaceholder': 'Enter your name',
    'form.titlePlaceholder': 'Enter title',
    'form.descriptionPlaceholder': 'Enter description',
    'form.selectOption': 'Select an option',
    'form.chooseFile': 'Choose file',
    'form.searchPianos': 'Search pianos...',
    'form.allSources': 'All Sources',
    'form.allYears': 'All Years',
    'form.allCategories': 'All Categories',

    // Piano-related
    'piano.title': 'Piano',
    'piano.pianos': 'Pianos',
    'piano.findPianos': 'Find Pianos',
    'piano.condition': 'Condition',
    'piano.publicPiano': 'Public Piano',
    'piano.verified': 'Verified',
    'piano.rating': 'Rating',
    'piano.reviews': 'Reviews',
    'piano.addReview': 'Add Review',
    'piano.gallery': 'Gallery',
    'piano.directions': 'Get Directions',
    'piano.reportIssue': 'Report Issue',

    // Events
    'event.title': 'Event',
    'event.events': 'Events',
    'event.upcomingEvents': 'Upcoming Events',
    'event.pastEvents': 'Past Events',
    'event.joinEvent': 'Join Event',
    'event.createEvent': 'Create Event',
    'event.eventDetails': 'Event Details',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Read More',
    'blog.author': 'Author',
    'blog.publishedOn': 'Published on',
    'blog.tags': 'Tags',
    'blog.relatedPosts': 'Related Posts',
    'blog.comments': 'Comments',
    'blog.addComment': 'Add Comment',

    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInWithGoogle': 'Sign in with Google',
    'auth.signInWithFacebook': 'Sign in with Facebook',

    // Footer
    'footer.description': 'Connecting piano enthusiasts worldwide, making it easy to find, share, and celebrate public pianos.',
    'footer.quickLinks': 'Quick Links',
    'footer.support': 'Support',
    'footer.findPianos': 'Find Pianos',
    'footer.events': 'Events',
    'footer.blog': 'Blog',
    'footer.aboutUs': 'About Us',
    'footer.contactUs': 'Contact Us',
    'footer.faq': 'FAQ',
    'footer.reportIssue': 'Report an Issue',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.copyright': '© {{year}} WorldPianos.org. All rights reserved.',
    'footer.madeWith': 'Made with ♪ for piano lovers worldwide',
    'footer.poweredBy': 'Powered by Sing for Hope',

    // Admin & Newsletter
    'admin.dashboard': 'Admin Dashboard',
    'admin.newsletter': 'Newsletter Management',
    'admin.newsletters': 'Newsletter',
    'admin.manageSubscribers': 'Manage newsletter subscribers',
    'admin.totalSubscribers': 'Total Subscribers',
    'admin.activeSubscribers': 'Active',
    'admin.unsubscribedSubscribers': 'Unsubscribed',
    'admin.bouncedSubscribers': 'Bounced',
    'admin.searchSubscribers': 'Search subscribers...',
    'admin.allStatus': 'All Status',
    'admin.active': 'Active',
    'admin.unsubscribed': 'Unsubscribed',
    'admin.bounced': 'Bounced',
    'admin.exportCsv': 'Export CSV',
    'admin.email': 'Email',
    'admin.name': 'Name',
    'admin.status': 'Status',
    'admin.source': 'Source',
    'admin.subscribed': 'Subscribed',
    'admin.actions': 'Actions',
    'admin.noSubscribers': 'No subscribers found',
    'admin.editSubscriber': 'Edit Subscriber',
    'admin.firstName': 'First Name',
    'admin.lastName': 'Last Name',
    'admin.preferences': 'Preferences',
    'admin.weeklyDigest': 'Weekly Digest',
    'admin.eventNotifications': 'Event Notifications',
    'admin.newPianoAlerts': 'New Piano Alerts',
    'admin.blogUpdates': 'Blog Updates',

    // Accessibility
    'a11y.skipToContent': 'Skip to main content',
    'a11y.openMenu': 'Open menu',
    'a11y.closeMenu': 'Close menu',
    'a11y.userMenu': 'User menu',
    'a11y.languageSelector': 'Language selector',
    'a11y.themeToggle': 'Toggle theme',
    'a11y.searchForm': 'Search form',
    'a11y.sortBy': 'Sort by',
    'a11y.filterBy': 'Filter by',
    'a11y.viewOnMap': 'View on map',
    'a11y.playAudio': 'Play audio',
    'a11y.pauseAudio': 'Pause audio',
    'a11y.nextImage': 'Next image',
    'a11y.previousImage': 'Previous image',
    'a11y.likePost': 'Like this post',
    'a11y.sharePost': 'Share this post',
    'a11y.reportContent': 'Report this content'
  },

  // Spanish translations
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.pianos': 'Encontrar Pianos',
    'nav.events': 'Eventos',
    'nav.blog': 'Artículos',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.profile': 'Perfil',
    'nav.dashboard': 'Panel',
    'nav.logout': 'Cerrar Sesión',
    'nav.admin': 'Admin',
    'nav.moderation': 'Moderación',
    'nav.add': 'Agregar',
    'nav.addPiano': 'Agregar Piano',
    'nav.addEvent': 'Agregar Evento',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.share': 'Compartir',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.location': 'Ubicación',
    'common.category': 'Categoría',
    'common.date': 'Fecha',
    'common.time': 'Hora',
    'common.description': 'Descripción',
    'common.submit': 'Enviar',
    'common.reset': 'Restablecer',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.all': 'Todos',
    'common.select': 'Seleccionar',
    'common.choose': 'Elegir',
    'common.upload': 'Subir',
    'common.optional': 'Opcional',
    'common.required': 'Requerido',
    'common.name': 'Nombre',
    'common.title': 'Título',
    'common.email': 'Correo',
    'common.website': 'Sitio Web',
    'common.phone': 'Teléfono',
    'common.address': 'Dirección',
    'common.notes': 'Notas',
    'common.details': 'Detalles',

    // Form placeholders
    'form.searchPlaceholder': 'Buscar...',
    'form.emailPlaceholder': 'Ingresa tu correo electrónico',
    'form.namePlaceholder': 'Ingresa tu nombre',
    'form.titlePlaceholder': 'Ingresa título',
    'form.descriptionPlaceholder': 'Ingresa descripción',
    'form.selectOption': 'Selecciona una opción',
    'form.chooseFile': 'Elegir archivo',
    'form.searchPianos': 'Buscar pianos...',
    'form.allSources': 'Todas las Fuentes',
    'form.allYears': 'Todos los Años',
    'form.allCategories': 'Todas las Categorías',

    // Piano-related
    'piano.title': 'Piano',
    'piano.pianos': 'Pianos',
    'piano.findPianos': 'Encontrar Pianos',
    'piano.condition': 'Condición',
    'piano.publicPiano': 'Piano Público',
    'piano.verified': 'Verificado',
    'piano.rating': 'Calificación',
    'piano.reviews': 'Reseñas',
    'piano.addReview': 'Agregar Reseña',
    'piano.gallery': 'Galería',
    'piano.directions': 'Obtener Direcciones',
    'piano.reportIssue': 'Reportar Problema',

    // Events
    'event.title': 'Evento',
    'event.events': 'Eventos',
    'event.upcomingEvents': 'Eventos Próximos',
    'event.pastEvents': 'Eventos Pasados',
    'event.joinEvent': 'Unirse al Evento',
    'event.createEvent': 'Crear Evento',
    'event.eventDetails': 'Detalles del Evento',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Leer Más',
    'blog.author': 'Autor',
    'blog.publishedOn': 'Publicado el',
    'blog.tags': 'Etiquetas',
    'blog.relatedPosts': 'Publicaciones Relacionadas',
    'blog.comments': 'Comentarios',
    'blog.addComment': 'Agregar Comentario',

    // Authentication
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.fullName': 'Nombre Completo',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.dontHaveAccount': '¿No tienes una cuenta?',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.signInWithGoogle': 'Iniciar sesión con Google',
    'auth.signInWithFacebook': 'Iniciar sesión con Facebook',

    // Footer
    'footer.description': 'Conectando entusiastas del piano en todo el mundo, facilitando encontrar, compartir y celebrar pianos públicos.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.support': 'Soporte',
    'footer.findPianos': 'Encontrar Pianos',
    'footer.events': 'Eventos',
    'footer.blog': 'Blog',
    'footer.aboutUs': 'Acerca de Nosotros',
    'footer.contactUs': 'Contáctanos',
    'footer.faq': 'Preguntas Frecuentes',
    'footer.reportIssue': 'Reportar un Problema',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.termsOfService': 'Términos de Servicio',
    'footer.copyright': '© {{year}} WorldPianos.org. Todos los derechos reservados.',
    'footer.madeWith': 'Hecho con ♪ para amantes del piano en todo el mundo',
    'footer.poweredBy': 'Impulsado por Sing for Hope',

    // Accessibility
    'a11y.skipToContent': 'Saltar al contenido principal',
    'a11y.openMenu': 'Abrir menú',
    'a11y.closeMenu': 'Cerrar menú',
    'a11y.userMenu': 'Menú de usuario',
    'a11y.languageSelector': 'Selector de idioma',
    'a11y.themeToggle': 'Cambiar tema',
    'a11y.searchForm': 'Formulario de búsqueda',
    'a11y.sortBy': 'Ordenar por',
    'a11y.filterBy': 'Filtrar por',
    'a11y.viewOnMap': 'Ver en el mapa',
    'a11y.playAudio': 'Reproducir audio',
    'a11y.pauseAudio': 'Pausar audio',
    'a11y.nextImage': 'Siguiente imagen',
    'a11y.previousImage': 'Imagen anterior',
    'a11y.likePost': 'Me gusta esta publicación',
    'a11y.sharePost': 'Compartir esta publicación',
    'a11y.reportContent': 'Reportar este contenido'
  },

  // French translations
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.pianos': 'Trouver des Pianos',
    'nav.events': 'Événements',
    'nav.blog': 'Articles',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Se connecter',
    'nav.signup': 'S\'inscrire',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Tableau de bord',
    'nav.logout': 'Se déconnecter',
    'nav.admin': 'Admin',
    'nav.moderation': 'Modération',
    'nav.add': 'Ajouter',
    'nav.addPiano': 'Ajouter Piano',
    'nav.addEvent': 'Ajouter Événement',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.share': 'Partager',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.location': 'Emplacement',
    'common.category': 'Catégorie',
    'common.date': 'Date',
    'common.time': 'Heure',
    'common.description': 'Description',
    'common.submit': 'Soumettre',
    'common.reset': 'Réinitialiser',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.open': 'Ouvrir',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.all': 'Tous',
    'common.select': 'Sélectionner',
    'common.choose': 'Choisir',
    'common.upload': 'Télécharger',
    'common.optional': 'Optionnel',
    'common.required': 'Requis',
    'common.name': 'Nom',
    'common.title': 'Titre',
    'common.email': 'E-mail',
    'common.website': 'Site Web',
    'common.phone': 'Téléphone',
    'common.address': 'Adresse',
    'common.notes': 'Notes',
    'common.details': 'Détails',

    // Form placeholders
    'form.searchPlaceholder': 'Rechercher...',
    'form.emailPlaceholder': 'Entrez votre adresse e-mail',
    'form.namePlaceholder': 'Entrez votre nom',
    'form.titlePlaceholder': 'Entrez le titre',
    'form.descriptionPlaceholder': 'Entrez la description',
    'form.selectOption': 'Sélectionnez une option',
    'form.chooseFile': 'Choisir un fichier',
    'form.searchPianos': 'Rechercher des pianos...',
    'form.allSources': 'Toutes les Sources',
    'form.allYears': 'Toutes les Années',
    'form.allCategories': 'Toutes les Catégories',

    // Piano-related
    'piano.title': 'Piano',
    'piano.pianos': 'Pianos',
    'piano.findPianos': 'Trouver des Pianos',
    'piano.condition': 'État',
    'piano.publicPiano': 'Piano Public',
    'piano.verified': 'Vérifié',
    'piano.rating': 'Note',
    'piano.reviews': 'Avis',
    'piano.addReview': 'Ajouter un Avis',
    'piano.gallery': 'Galerie',
    'piano.directions': 'Obtenir les Directions',
    'piano.reportIssue': 'Signaler un Problème',

    // Events
    'event.title': 'Événement',
    'event.events': 'Événements',
    'event.upcomingEvents': 'Événements à Venir',
    'event.pastEvents': 'Événements Passés',
    'event.joinEvent': 'Rejoindre l\'Événement',
    'event.createEvent': 'Créer un Événement',
    'event.eventDetails': 'Détails de l\'Événement',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Lire Plus',
    'blog.author': 'Auteur',
    'blog.publishedOn': 'Publié le',
    'blog.tags': 'Étiquettes',
    'blog.relatedPosts': 'Articles Connexes',
    'blog.comments': 'Commentaires',
    'blog.addComment': 'Ajouter un Commentaire',

    // Authentication
    'auth.signIn': 'Se connecter',
    'auth.signUp': 'S\'inscrire',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.fullName': 'Nom complet',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.dontHaveAccount': 'Vous n\'avez pas de compte ?',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte ?',
    'auth.signInWithGoogle': 'Se connecter avec Google',
    'auth.signInWithFacebook': 'Se connecter avec Facebook',

    // Accessibility
    'a11y.skipToContent': 'Aller au contenu principal',
    'a11y.openMenu': 'Ouvrir le menu',
    'a11y.closeMenu': 'Fermer le menu',
    'a11y.userMenu': 'Menu utilisateur',
    'a11y.languageSelector': 'Sélecteur de langue',
    'a11y.themeToggle': 'Basculer le thème',
    'a11y.searchForm': 'Formulaire de recherche',
    'a11y.sortBy': 'Trier par',
    'a11y.filterBy': 'Filtrer par',
    'a11y.viewOnMap': 'Voir sur la carte',
    'a11y.playAudio': 'Lire l\'audio',
    'a11y.pauseAudio': 'Mettre en pause l\'audio',
    'a11y.nextImage': 'Image suivante',
    'a11y.previousImage': 'Image précédente',
    'a11y.likePost': 'Aimer cet article',
    'a11y.sharePost': 'Partager cet article',
    'a11y.reportContent': 'Signaler ce contenu'
  },
  // German translations
  de: {
    'nav.home': 'Startseite', 'nav.pianos': 'Klaviere Finden', 'nav.events': 'Veranstaltungen', 'nav.blog': 'Blog', 'nav.about': 'Über uns', 'nav.contact': 'Kontakt', 'nav.login': 'Anmelden', 'nav.signup': 'Registrieren', 'nav.profile': 'Profil', 'nav.dashboard': 'Dashboard', 'nav.logout': 'Abmelden', 'nav.admin': 'Admin', 'nav.moderation': 'Moderation', 'nav.add': 'Hinzufügen', 'nav.addPiano': 'Klavier Hinzufügen', 'nav.addEvent': 'Veranstaltung Hinzufügen',
    'common.loading': 'Laden...', 'common.error': 'Fehler', 'common.success': 'Erfolg', 'common.cancel': 'Abbrechen', 'common.save': 'Speichern', 'common.delete': 'Löschen', 'common.edit': 'Bearbeiten', 'common.view': 'Ansehen', 'common.share': 'Teilen', 'common.search': 'Suchen', 'common.filter': 'Filter', 'common.sort': 'Sortieren', 'common.location': 'Standort', 'common.category': 'Kategorie', 'common.date': 'Datum', 'common.time': 'Zeit', 'common.description': 'Beschreibung', 'common.submit': 'Senden', 'common.reset': 'Zurücksetzen', 'common.back': 'Zurück', 'common.next': 'Weiter', 'common.previous': 'Vorherige', 'common.close': 'Schließen', 'common.open': 'Öffnen', 'common.yes': 'Ja', 'common.no': 'Nein', 'common.all': 'Alle', 'common.select': 'Auswählen', 'common.choose': 'Wählen', 'common.upload': 'Hochladen', 'common.optional': 'Optional', 'common.required': 'Erforderlich', 'common.name': 'Name', 'common.title': 'Titel', 'common.email': 'E-Mail', 'common.website': 'Website', 'common.phone': 'Telefon', 'common.address': 'Adresse', 'common.notes': 'Notizen', 'common.details': 'Details', 'form.searchPlaceholder': 'Suchen...', 'form.emailPlaceholder': 'E-Mail-Adresse eingeben', 'form.namePlaceholder': 'Name eingeben', 'form.titlePlaceholder': 'Titel eingeben', 'form.descriptionPlaceholder': 'Beschreibung eingeben', 'form.selectOption': 'Option auswählen', 'form.chooseFile': 'Datei wählen', 'form.searchPianos': 'Klaviere suchen...', 'form.allSources': 'Alle Quellen', 'form.allYears': 'Alle Jahre', 'form.allCategories': 'Alle Kategorien',
    'piano.title': 'Klavier', 'piano.pianos': 'Klaviere', 'piano.findPianos': 'Klaviere Finden', 'piano.condition': 'Zustand', 'piano.publicPiano': 'Öffentliches Klavier', 'piano.verified': 'Verifiziert', 'piano.rating': 'Bewertung', 'piano.reviews': 'Bewertungen', 'piano.addReview': 'Bewertung Hinzufügen', 'piano.gallery': 'Galerie', 'piano.directions': 'Wegbeschreibung', 'piano.reportIssue': 'Problem Melden',
    'event.title': 'Veranstaltung', 'event.events': 'Veranstaltungen', 'event.upcomingEvents': 'Kommende Veranstaltungen', 'event.pastEvents': 'Vergangene Veranstaltungen', 'event.joinEvent': 'An Veranstaltung Teilnehmen', 'event.createEvent': 'Veranstaltung Erstellen', 'event.eventDetails': 'Veranstaltungsdetails',
    'blog.title': 'Blog', 'blog.readMore': 'Mehr Lesen', 'blog.author': 'Autor', 'blog.publishedOn': 'Veröffentlicht am', 'blog.tags': 'Tags', 'blog.relatedPosts': 'Verwandte Beiträge', 'blog.comments': 'Kommentare', 'blog.addComment': 'Kommentar Hinzufügen',
    'auth.signIn': 'Anmelden', 'auth.signUp': 'Registrieren', 'auth.email': 'E-Mail', 'auth.password': 'Passwort', 'auth.confirmPassword': 'Passwort Bestätigen', 'auth.fullName': 'Vollständiger Name', 'auth.forgotPassword': 'Passwort vergessen?', 'auth.dontHaveAccount': 'Haben Sie kein Konto?', 'auth.alreadyHaveAccount': 'Haben Sie bereits ein Konto?', 'auth.signInWithGoogle': 'Mit Google Anmelden', 'auth.signInWithFacebook': 'Mit Facebook Anmelden',
    'footer.description': 'Klavierbegeisterte weltweit verbinden und das Finden, Teilen und Feiern öffentlicher Klaviere erleichtern.', 'footer.quickLinks': 'Schnelle Links', 'footer.support': 'Support', 'footer.findPianos': 'Klaviere Finden', 'footer.events': 'Veranstaltungen', 'footer.blog': 'Blog', 'footer.aboutUs': 'Über Uns', 'footer.contactUs': 'Kontakt', 'footer.faq': 'FAQ', 'footer.reportIssue': 'Problem Melden', 'footer.privacyPolicy': 'Datenschutzrichtlinie', 'footer.termsOfService': 'Nutzungsbedingungen', 'footer.copyright': '© {{year}} WorldPianos.org. Alle Rechte vorbehalten.', 'footer.madeWith': 'Mit ♪ für Klavierliebhaber weltweit gemacht', 'footer.poweredBy': 'Unterstützt von Sing for Hope',
    'a11y.skipToContent': 'Zum Hauptinhalt Springen', 'a11y.openMenu': 'Menü Öffnen', 'a11y.closeMenu': 'Menü Schließen', 'a11y.userMenu': 'Benutzermenü', 'a11y.languageSelector': 'Sprachauswahl', 'a11y.themeToggle': 'Design Wechseln', 'a11y.searchForm': 'Suchformular', 'a11y.sortBy': 'Sortieren nach', 'a11y.filterBy': 'Filtern nach', 'a11y.viewOnMap': 'Auf Karte Anzeigen', 'a11y.playAudio': 'Audio Abspielen', 'a11y.pauseAudio': 'Audio Pausieren', 'a11y.nextImage': 'Nächstes Bild', 'a11y.previousImage': 'Vorheriges Bild', 'a11y.likePost': 'Diesen Beitrag Mögen', 'a11y.sharePost': 'Diesen Beitrag Teilen', 'a11y.reportContent': 'Diesen Inhalt Melden'
  },

  // Italian translations
  it: {
    'nav.home': 'Home', 'nav.pianos': 'Trova Pianoforti', 'nav.events': 'Eventi', 'nav.blog': 'Blog', 'nav.about': 'Chi Siamo', 'nav.contact': 'Contatto', 'nav.login': 'Accedi', 'nav.signup': 'Registrati', 'nav.profile': 'Profilo', 'nav.dashboard': 'Dashboard', 'nav.logout': 'Esci', 'nav.admin': 'Admin', 'nav.moderation': 'Moderazione', 'nav.add': 'Aggiungi', 'nav.addPiano': 'Aggiungi Pianoforte', 'nav.addEvent': 'Aggiungi Evento',
    'common.loading': 'Caricamento...', 'common.error': 'Errore', 'common.success': 'Successo', 'common.cancel': 'Annulla', 'common.save': 'Salva', 'common.delete': 'Elimina', 'common.edit': 'Modifica', 'common.view': 'Visualizza', 'common.share': 'Condividi', 'common.search': 'Cerca', 'common.filter': 'Filtra', 'common.sort': 'Ordina', 'common.location': 'Posizione', 'common.category': 'Categoria', 'common.date': 'Data', 'common.time': 'Ora', 'common.description': 'Descrizione', 'common.submit': 'Invia', 'common.reset': 'Reimposta', 'common.back': 'Indietro', 'common.next': 'Avanti', 'common.previous': 'Precedente', 'common.close': 'Chiudi', 'common.open': 'Apri', 'common.yes': 'Sì', 'common.no': 'No',
    'piano.title': 'Pianoforte', 'piano.pianos': 'Pianoforti', 'piano.findPianos': 'Trova Pianoforti', 'piano.condition': 'Condizione', 'piano.publicPiano': 'Pianoforte Pubblico', 'piano.verified': 'Verificato', 'piano.rating': 'Valutazione', 'piano.reviews': 'Recensioni', 'piano.addReview': 'Aggiungi Recensione', 'piano.gallery': 'Galleria', 'piano.directions': 'Indicazioni', 'piano.reportIssue': 'Segnala Problema',
    'event.title': 'Evento', 'event.events': 'Eventi', 'event.upcomingEvents': 'Eventi Imminenti', 'event.pastEvents': 'Eventi Passati', 'event.joinEvent': 'Partecipa all\'Evento', 'event.createEvent': 'Crea Evento', 'event.eventDetails': 'Dettagli Evento',
    'blog.title': 'Blog', 'blog.readMore': 'Leggi di Più', 'blog.author': 'Autore', 'blog.publishedOn': 'Pubblicato il', 'blog.tags': 'Tag', 'blog.relatedPosts': 'Post Correlati', 'blog.comments': 'Commenti', 'blog.addComment': 'Aggiungi Commento',
    'auth.signIn': 'Accedi', 'auth.signUp': 'Registrati', 'auth.email': 'Email', 'auth.password': 'Password', 'auth.confirmPassword': 'Conferma Password', 'auth.fullName': 'Nome Completo', 'auth.forgotPassword': 'Password Dimenticata?', 'auth.dontHaveAccount': 'Non hai un account?', 'auth.alreadyHaveAccount': 'Hai già un account?', 'auth.signInWithGoogle': 'Accedi con Google', 'auth.signInWithFacebook': 'Accedi con Facebook',
    'footer.description': 'Connettere gli appassionati di pianoforte in tutto il mondo, rendendo facile trovare, condividere e celebrare i pianoforti pubblici.', 'footer.quickLinks': 'Link Rapidi', 'footer.support': 'Supporto', 'footer.findPianos': 'Trova Pianoforti', 'footer.events': 'Eventi', 'footer.blog': 'Blog', 'footer.aboutUs': 'Chi Siamo', 'footer.contactUs': 'Contattaci', 'footer.faq': 'FAQ', 'footer.reportIssue': 'Segnala Problema', 'footer.privacyPolicy': 'Privacy Policy', 'footer.termsOfService': 'Termini di Servizio', 'footer.copyright': '© {{year}} WorldPianos.org. Tutti i diritti riservati.', 'footer.madeWith': 'Realizzato con ♪ per gli amanti del pianoforte di tutto il mondo', 'footer.poweredBy': 'Powered by Sing for Hope',
    'a11y.skipToContent': 'Salta al Contenuto Principale', 'a11y.openMenu': 'Apri Menu', 'a11y.closeMenu': 'Chiudi Menu', 'a11y.userMenu': 'Menu Utente', 'a11y.languageSelector': 'Selettore Lingua', 'a11y.themeToggle': 'Cambia Tema', 'a11y.searchForm': 'Modulo di Ricerca', 'a11y.sortBy': 'Ordina per', 'a11y.filterBy': 'Filtra per', 'a11y.viewOnMap': 'Visualizza sulla Mappa', 'a11y.playAudio': 'Riproduci Audio', 'a11y.pauseAudio': 'Pausa Audio', 'a11y.nextImage': 'Immagine Successiva', 'a11y.previousImage': 'Immagine Precedente', 'a11y.likePost': 'Mi Piace Questo Post', 'a11y.sharePost': 'Condividi Questo Post', 'a11y.reportContent': 'Segnala Questo Contenuto'
  },

  // Portuguese translations
  pt: {
    'nav.home': 'Início', 'nav.pianos': 'Encontrar Pianos', 'nav.events': 'Eventos', 'nav.blog': 'Blog', 'nav.about': 'Sobre', 'nav.contact': 'Contato', 'nav.login': 'Entrar', 'nav.signup': 'Registrar', 'nav.profile': 'Perfil', 'nav.dashboard': 'Painel', 'nav.logout': 'Sair', 'nav.admin': 'Admin', 'nav.moderation': 'Moderação', 'nav.add': 'Adicionar', 'nav.addPiano': 'Adicionar Piano', 'nav.addEvent': 'Adicionar Evento',
    'common.loading': 'Carregando...', 'common.error': 'Erro', 'common.success': 'Sucesso', 'common.cancel': 'Cancelar', 'common.save': 'Salvar', 'common.delete': 'Excluir', 'common.edit': 'Editar', 'common.view': 'Ver', 'common.share': 'Compartilhar', 'common.search': 'Pesquisar', 'common.filter': 'Filtrar', 'common.sort': 'Ordenar', 'common.location': 'Localização', 'common.category': 'Categoria', 'common.date': 'Data', 'common.time': 'Hora', 'common.description': 'Descrição', 'common.submit': 'Enviar', 'common.reset': 'Redefinir', 'common.back': 'Voltar', 'common.next': 'Próximo', 'common.previous': 'Anterior', 'common.close': 'Fechar', 'common.open': 'Abrir', 'common.yes': 'Sim', 'common.no': 'Não',
    'piano.title': 'Piano', 'piano.pianos': 'Pianos', 'piano.findPianos': 'Encontrar Pianos', 'piano.condition': 'Condição', 'piano.publicPiano': 'Piano Público', 'piano.verified': 'Verificado', 'piano.rating': 'Avaliação', 'piano.reviews': 'Avaliações', 'piano.addReview': 'Adicionar Avaliação', 'piano.gallery': 'Galeria', 'piano.directions': 'Direções', 'piano.reportIssue': 'Relatar Problema',
    'event.title': 'Evento', 'event.events': 'Eventos', 'event.upcomingEvents': 'Eventos Próximos', 'event.pastEvents': 'Eventos Passados', 'event.joinEvent': 'Participar do Evento', 'event.createEvent': 'Criar Evento', 'event.eventDetails': 'Detalhes do Evento',
    'blog.title': 'Blog', 'blog.readMore': 'Ler Mais', 'blog.author': 'Autor', 'blog.publishedOn': 'Publicado em', 'blog.tags': 'Tags', 'blog.relatedPosts': 'Posts Relacionados', 'blog.comments': 'Comentários', 'blog.addComment': 'Adicionar Comentário',
    'auth.signIn': 'Entrar', 'auth.signUp': 'Registrar', 'auth.email': 'E-mail', 'auth.password': 'Senha', 'auth.confirmPassword': 'Confirmar Senha', 'auth.fullName': 'Nome Completo', 'auth.forgotPassword': 'Esqueceu a senha?', 'auth.dontHaveAccount': 'Não tem uma conta?', 'auth.alreadyHaveAccount': 'Já tem uma conta?', 'auth.signInWithGoogle': 'Entrar com Google', 'auth.signInWithFacebook': 'Entrar com Facebook',
    'footer.description': 'Conectar entusiastas de piano em todo o mundo, facilitando encontrar, compartilhar e celebrar pianos públicos.', 'footer.quickLinks': 'Links Rápidos', 'footer.support': 'Suporte', 'footer.findPianos': 'Encontrar Pianos', 'footer.events': 'Eventos', 'footer.blog': 'Blog', 'footer.aboutUs': 'Sobre Nós', 'footer.contactUs': 'Contate-nos', 'footer.faq': 'FAQ', 'footer.reportIssue': 'Relatar Problema', 'footer.privacyPolicy': 'Política de Privacidade', 'footer.termsOfService': 'Termos de Serviço', 'footer.copyright': '© {{year}} WorldPianos.org. Todos os direitos reservados.', 'footer.madeWith': 'Feito com ♪ para amantes de piano em todo o mundo', 'footer.poweredBy': 'Powered by Sing for Hope',
    'a11y.skipToContent': 'Pular para o Conteúdo Principal', 'a11y.openMenu': 'Abrir Menu', 'a11y.closeMenu': 'Fechar Menu', 'a11y.userMenu': 'Menu do Usuário', 'a11y.languageSelector': 'Seletor de Idioma', 'a11y.themeToggle': 'Alternar Tema', 'a11y.searchForm': 'Formulário de Pesquisa', 'a11y.sortBy': 'Ordenar por', 'a11y.filterBy': 'Filtrar por', 'a11y.viewOnMap': 'Ver no Mapa', 'a11y.playAudio': 'Reproduzir Áudio', 'a11y.pauseAudio': 'Pausar Áudio', 'a11y.nextImage': 'Próxima Imagem', 'a11y.previousImage': 'Imagem Anterior', 'a11y.likePost': 'Curtir Este Post', 'a11y.sharePost': 'Compartilhar Este Post', 'a11y.reportContent': 'Relatar Este Conteúdo'
  },

  // Japanese translations
  ja: {
    'nav.home': 'ホーム', 'nav.pianos': 'ピアノを探す', 'nav.events': 'イベント', 'nav.blog': 'ブログ', 'nav.about': '概要', 'nav.contact': 'お問い合わせ', 'nav.login': 'ログイン', 'nav.signup': '登録', 'nav.profile': 'プロフィール', 'nav.dashboard': 'ダッシュボード', 'nav.logout': 'ログアウト', 'nav.admin': '管理', 'nav.moderation': 'モデレーション', 'nav.add': '追加', 'nav.addPiano': 'ピアノを追加', 'nav.addEvent': 'イベントを追加',
    'common.loading': '読み込み中...', 'common.error': 'エラー', 'common.success': '成功', 'common.cancel': 'キャンセル', 'common.save': '保存', 'common.delete': '削除', 'common.edit': '編集', 'common.view': '表示', 'common.share': '共有', 'common.search': '検索', 'common.filter': 'フィルター', 'common.sort': '並び替え', 'common.location': '場所', 'common.category': 'カテゴリー', 'common.date': '日付', 'common.time': '時間', 'common.description': '説明', 'common.submit': '送信', 'common.reset': 'リセット', 'common.back': '戻る', 'common.next': '次へ', 'common.previous': '前へ', 'common.close': '閉じる', 'common.open': '開く', 'common.yes': 'はい', 'common.no': 'いいえ',
    'piano.title': 'ピアノ', 'piano.pianos': 'ピアノ', 'piano.findPianos': 'ピアノを探す', 'piano.condition': '状態', 'piano.publicPiano': '公共ピアノ', 'piano.verified': '確認済み', 'piano.rating': '評価', 'piano.reviews': 'レビュー', 'piano.addReview': 'レビューを追加', 'piano.gallery': 'ギャラリー', 'piano.directions': '道順', 'piano.reportIssue': '問題を報告',
    'event.title': 'イベント', 'event.events': 'イベント', 'event.upcomingEvents': '今後のイベント', 'event.pastEvents': '過去のイベント', 'event.joinEvent': 'イベントに参加', 'event.createEvent': 'イベントを作成', 'event.eventDetails': 'イベント詳細',
    'blog.title': 'ブログ', 'blog.readMore': '続きを読む', 'blog.author': '著者', 'blog.publishedOn': '公開日', 'blog.tags': 'タグ', 'blog.relatedPosts': '関連記事', 'blog.comments': 'コメント', 'blog.addComment': 'コメントを追加',
    'auth.signIn': 'ログイン', 'auth.signUp': '登録', 'auth.email': 'メール', 'auth.password': 'パスワード', 'auth.confirmPassword': 'パスワードを確認', 'auth.fullName': '氏名', 'auth.forgotPassword': 'パスワードを忘れましたか？', 'auth.dontHaveAccount': 'アカウントをお持ちでないですか？', 'auth.alreadyHaveAccount': 'すでにアカウントをお持ちですか？', 'auth.signInWithGoogle': 'Googleでログイン', 'auth.signInWithFacebook': 'Facebookでログイン',
    'footer.description': '世界中のピアノ愛好家をつなぎ、公共ピアノを見つけて、共有し、祝うことを簡単にします。', 'footer.quickLinks': 'クイックリンク', 'footer.support': 'サポート', 'footer.findPianos': 'ピアノを探す', 'footer.events': 'イベント', 'footer.blog': 'ブログ', 'footer.aboutUs': '私たちについて', 'footer.contactUs': 'お問い合わせ', 'footer.faq': 'よくある質問', 'footer.reportIssue': '問題を報告', 'footer.privacyPolicy': 'プライバシーポリシー', 'footer.termsOfService': '利用規約', 'footer.copyright': '© {{year}} WorldPianos.org. 全著作権所有。', 'footer.madeWith': '世界中のピアノ愛好家のために♪で作られました', 'footer.poweredBy': 'Sing for Hopeの支援による',
    'a11y.skipToContent': 'メインコンテンツにスキップ', 'a11y.openMenu': 'メニューを開く', 'a11y.closeMenu': 'メニューを閉じる', 'a11y.userMenu': 'ユーザーメニュー', 'a11y.languageSelector': '言語選択', 'a11y.themeToggle': 'テーマを切り替え', 'a11y.searchForm': '検索フォーム', 'a11y.sortBy': '並び替え', 'a11y.filterBy': 'フィルター', 'a11y.viewOnMap': '地図で表示', 'a11y.playAudio': '音声を再生', 'a11y.pauseAudio': '音声を一時停止', 'a11y.nextImage': '次の画像', 'a11y.previousImage': '前の画像', 'a11y.likePost': 'この投稿にいいね', 'a11y.sharePost': 'この投稿を共有', 'a11y.reportContent': 'このコンテンツを報告'
  },

  // Korean translations
  ko: {
    'nav.home': '홈', 'nav.pianos': '피아노 찾기', 'nav.events': '이벤트', 'nav.blog': '블로그', 'nav.about': '소개', 'nav.contact': '연락처', 'nav.login': '로그인', 'nav.signup': '회원가입', 'nav.profile': '프로필', 'nav.dashboard': '대시보드', 'nav.logout': '로그아웃', 'nav.admin': '관리자', 'nav.moderation': '조정', 'nav.add': '추가', 'nav.addPiano': '피아노 추가', 'nav.addEvent': '이벤트 추가',
    'common.loading': '로딩 중...', 'common.error': '오류', 'common.success': '성공', 'common.cancel': '취소', 'common.save': '저장', 'common.delete': '삭제', 'common.edit': '편집', 'common.view': '보기', 'common.share': '공유', 'common.search': '검색', 'common.filter': '필터', 'common.sort': '정렬', 'common.location': '위치', 'common.category': '카테고리', 'common.date': '날짜', 'common.time': '시간', 'common.description': '설명', 'common.submit': '제출', 'common.reset': '초기화', 'common.back': '뒤로', 'common.next': '다음', 'common.previous': '이전', 'common.close': '닫기', 'common.open': '열기', 'common.yes': '예', 'common.no': '아니요',
    'piano.title': '피아노', 'piano.pianos': '피아노', 'piano.findPianos': '피아노 찾기', 'piano.condition': '상태', 'piano.publicPiano': '공공 피아노', 'piano.verified': '인증됨', 'piano.rating': '평점', 'piano.reviews': '리뷰', 'piano.addReview': '리뷰 추가', 'piano.gallery': '갤러리', 'piano.directions': '길찾기', 'piano.reportIssue': '문제 신고',
    'event.title': '이벤트', 'event.events': '이벤트', 'event.upcomingEvents': '예정된 이벤트', 'event.pastEvents': '지난 이벤트', 'event.joinEvent': '이벤트 참여', 'event.createEvent': '이벤트 생성', 'event.eventDetails': '이벤트 세부사항',
    'blog.title': '블로그', 'blog.readMore': '더 읽기', 'blog.author': '저자', 'blog.publishedOn': '게시일', 'blog.tags': '태그', 'blog.relatedPosts': '관련 글', 'blog.comments': '댓글', 'blog.addComment': '댓글 추가',
    'auth.signIn': '로그인', 'auth.signUp': '회원가입', 'auth.email': '이메일', 'auth.password': '비밀번호', 'auth.confirmPassword': '비밀번호 확인', 'auth.fullName': '전체 이름', 'auth.forgotPassword': '비밀번호를 잊으셨나요?', 'auth.dontHaveAccount': '계정이 없으신가요?', 'auth.alreadyHaveAccount': '이미 계정이 있으신가요?', 'auth.signInWithGoogle': 'Google로 로그인', 'auth.signInWithFacebook': 'Facebook으로 로그인',
    'footer.description': '전 세계 피아노 애호가들을 연결하고 공공 피아노를 찾고, 공유하고, 축하하는 것을 쉽게 만듭니다.', 'footer.quickLinks': '빠른 링크', 'footer.support': '지원', 'footer.findPianos': '피아노 찾기', 'footer.events': '이벤트', 'footer.blog': '블로그', 'footer.aboutUs': '회사 소개', 'footer.contactUs': '문의하기', 'footer.faq': '자주 묻는 질문', 'footer.reportIssue': '문제 신고', 'footer.privacyPolicy': '개인정보 보호정책', 'footer.termsOfService': '서비스 약관', 'footer.copyright': '© {{year}} WorldPianos.org. 모든 권리 보유.', 'footer.madeWith': '전 세계 피아노 애호가들을 위해 ♪로 만들어짐', 'footer.poweredBy': 'Sing for Hope 지원',
    'a11y.skipToContent': '메인 콘텐츠로 건너뛰기', 'a11y.openMenu': '메뉴 열기', 'a11y.closeMenu': '메뉴 닫기', 'a11y.userMenu': '사용자 메뉴', 'a11y.languageSelector': '언어 선택기', 'a11y.themeToggle': '테마 전환', 'a11y.searchForm': '검색 양식', 'a11y.sortBy': '정렬 기준', 'a11y.filterBy': '필터 기준', 'a11y.viewOnMap': '지도에서 보기', 'a11y.playAudio': '오디오 재생', 'a11y.pauseAudio': '오디오 일시정지', 'a11y.nextImage': '다음 이미지', 'a11y.previousImage': '이전 이미지', 'a11y.likePost': '이 글 좋아요', 'a11y.sharePost': '이 글 공유', 'a11y.reportContent': '이 콘텐츠 신고'
  },

  // Chinese translations
  zh: {
    'nav.home': '首页', 'nav.pianos': '寻找钢琴', 'nav.events': '活动', 'nav.blog': '博客', 'nav.about': '关于', 'nav.contact': '联系', 'nav.login': '登录', 'nav.signup': '注册', 'nav.profile': '资料', 'nav.dashboard': '仪表板', 'nav.logout': '登出', 'nav.admin': '管理', 'nav.moderation': '审核', 'nav.add': '添加', 'nav.addPiano': '添加钢琴', 'nav.addEvent': '添加活动',
    'common.loading': '加载中...', 'common.error': '错误', 'common.success': '成功', 'common.cancel': '取消', 'common.save': '保存', 'common.delete': '删除', 'common.edit': '编辑', 'common.view': '查看', 'common.share': '分享', 'common.search': '搜索', 'common.filter': '筛选', 'common.sort': '排序', 'common.location': '位置', 'common.category': '类别', 'common.date': '日期', 'common.time': '时间', 'common.description': '描述', 'common.submit': '提交', 'common.reset': '重置', 'common.back': '返回', 'common.next': '下一步', 'common.previous': '上一步', 'common.close': '关闭', 'common.open': '打开', 'common.yes': '是', 'common.no': '否',
    'piano.title': '钢琴', 'piano.pianos': '钢琴', 'piano.findPianos': '寻找钢琴', 'piano.condition': '状况', 'piano.publicPiano': '公共钢琴', 'piano.verified': '已验证', 'piano.rating': '评分', 'piano.reviews': '评论', 'piano.addReview': '添加评论', 'piano.gallery': '画廊', 'piano.directions': '路线', 'piano.reportIssue': '报告问题',
    'event.title': '活动', 'event.events': '活动', 'event.upcomingEvents': '即将举行的活动', 'event.pastEvents': '过去的活动', 'event.joinEvent': '参加活动', 'event.createEvent': '创建活动', 'event.eventDetails': '活动详情',
    'blog.title': '博客', 'blog.readMore': '阅读更多', 'blog.author': '作者', 'blog.publishedOn': '发布于', 'blog.tags': '标签', 'blog.relatedPosts': '相关文章', 'blog.comments': '评论', 'blog.addComment': '添加评论',
    'auth.signIn': '登录', 'auth.signUp': '注册', 'auth.email': '邮箱', 'auth.password': '密码', 'auth.confirmPassword': '确认密码', 'auth.fullName': '全名', 'auth.forgotPassword': '忘记密码？', 'auth.dontHaveAccount': '没有账户？', 'auth.alreadyHaveAccount': '已有账户？', 'auth.signInWithGoogle': '用Google登录', 'auth.signInWithFacebook': '用Facebook登录',
    'footer.description': '连接全世界的钢琴爱好者，让寻找、分享和庆祝公共钢琴变得简单。', 'footer.quickLinks': '快速链接', 'footer.support': '支持', 'footer.findPianos': '寻找钢琴', 'footer.events': '活动', 'footer.blog': '博客', 'footer.aboutUs': '关于我们', 'footer.contactUs': '联系我们', 'footer.faq': '常见问题', 'footer.reportIssue': '报告问题', 'footer.privacyPolicy': '隐私政策', 'footer.termsOfService': '服务条款', 'footer.copyright': '© {{year}} WorldPianos.org. 版权所有。', 'footer.madeWith': '为全世界钢琴爱好者用♪制作', 'footer.poweredBy': '由Sing for Hope提供支持',
    'a11y.skipToContent': '跳转到主要内容', 'a11y.openMenu': '打开菜单', 'a11y.closeMenu': '关闭菜单', 'a11y.userMenu': '用户菜单', 'a11y.languageSelector': '语言选择器', 'a11y.themeToggle': '切换主题', 'a11y.searchForm': '搜索表单', 'a11y.sortBy': '排序方式', 'a11y.filterBy': '筛选方式', 'a11y.viewOnMap': '在地图上查看', 'a11y.playAudio': '播放音频', 'a11y.pauseAudio': '暂停音频', 'a11y.nextImage': '下一张图片', 'a11y.previousImage': '上一张图片', 'a11y.likePost': '点赞这篇文章', 'a11y.sharePost': '分享这篇文章', 'a11y.reportContent': '举报此内容'
  }
}

// Fill empty language objects with English fallbacks
Object.keys(translations).forEach(lang => {
  if (lang !== 'en') {
    const langTranslations = translations[lang as SupportedLanguage]
    Object.keys(translations.en).forEach(key => {
      if (!langTranslations[key]) {
        langTranslations[key] = translations.en[key]
      }
    })
  }
})

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    // Try to get language from localStorage, URL path, URL parameter, or browser preference
    const stored = localStorage.getItem('language') as SupportedLanguage
    if (stored && Object.keys(LANGUAGE_CONFIG).includes(stored)) {
      return stored
    }

    // Check URL path (e.g., /es/pianos, /fr/events)
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      const pathLang = pathParts[0] as SupportedLanguage
      if (Object.keys(LANGUAGE_CONFIG).includes(pathLang)) {
        return pathLang
      }
    }

    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang') as SupportedLanguage
    if (urlLang && Object.keys(LANGUAGE_CONFIG).includes(urlLang)) {
      return urlLang
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage
    if (Object.keys(LANGUAGE_CONFIG).includes(browserLang)) {
      return browserLang
    }

    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.documentElement.dir = LANGUAGE_CONFIG[language].rtl ? 'rtl' : 'ltr'

    // Update URL parameter for better SEO and sharing
    const url = new URL(window.location.href)
    if (language !== 'en') {
      url.searchParams.set('lang', language)
    } else {
      url.searchParams.delete('lang')
    }
    
    // Update URL without page refresh if language parameter changed
    if (url.href !== window.location.href) {
      window.history.replaceState({}, '', url.href)
    }

    // Update page title and meta tags for SEO
    const currentTitle = document.title
    if (!currentTitle.includes(' | WorldPianos')) {
      document.title = `${currentTitle} | WorldPianos`
    }
  }, [language])

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations.en[key] || key

    // Development logging to debug translation issues
    if (process.env.NODE_ENV === 'development' && key === 'nav.blog') {
      console.log(`[i18n Debug] ${language}:${key} -> "${translation}"`)
    }

    // Handle parameter substitution
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value))
      })
    }

    return translation
  }

  const supportedLanguages = Object.entries(LANGUAGE_CONFIG).map(([code, config]) => ({
    code: code as SupportedLanguage,
    name: config.name,
    nativeName: config.nativeName,
    flag: config.flag
  }))

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL: LANGUAGE_CONFIG[language].rtl,
    supportedLanguages
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// HOC for components that need translation
export function withTranslation<T extends {}>(Component: React.ComponentType<T>) {
  return function TranslatedComponent(props: T) {
    const { t } = useLanguage()
    return <Component {...props} t={t} />
  }
}