# 🍳 Moje Kuchařka – Chytrý digitální receptář

Moderní mobilní aplikace typu **PWA** (Progressive Web App) postavená na frameworku **Ionic** a **Angular**. Aplikace slouží k interaktivnímu vyhledávání receptů, správě uživatelského profilu a ukládání oblíbených jídel do cloudu.

## ✨ Klíčové vlastnosti (USP)
- **Personalizace:** Unikátní uživatelský profil se synchronizací jména z Firebase Authentication.
- **Vlastní API Endpoint:** Recepty jsou načítány asynchronně z vlastního JSON rozhraní hostovaného na GitHub Gists. To zajišťuje bleskovou odezvu a 100% kontrolu nad daty.
- **Cloudové Oblíbené:** Integrace s Firebase Firestore – vaše srdíčkem označené recepty jsou v bezpečí i po odhlášení.
- **Adaptivní Design:** Plná podpora Dark & Light Mode postavená na CSS proměnných pro špičkový vizuální zážitek.
- **Vysoký výkon:** Vlastní implementace Infinite Scroll a optimalizovaná registrace ikon (Ionicons).

## 🛠️ Použité technologie
- **Frontend:** Ionic v7+, Angular v18 (Standalone Components)
- **Backend:** Google Firebase (Authentication pro uživatele, Firestore pro ukládání oblíbených)
- **Data:** Vlastní JSON API hostované na GitHub Gist (umožňuje plnou kontrolu nad strukturou receptů)
- **Optimalizace:** Service Worker (PWA Ready), Custom Scroll Detection

---

## 🚀 Jak aplikaci zprovoznit

Následujte tyto kroky pro lokální spuštění projektu na vašem počítači:

### 1. Prerekvizity
Před instalací se ujistěte, že máte nainstalované:
- **Node.js** (verze 18.x nebo novější)
- **Ionic CLI**:
  ```bash
  npm install -g @ionic/cli
  
- **Firebase CLI:**
  ```bash
  npm install -g firebase-tools 

### 2. Instalace a nastavení
- **Klonování repozitáře:** Stáhněte si kód do svého počítače.
- **Instalace závislostí:** V terminálu uvnitř složky projektu spusťte:
  ```bash
  npm install
- **Konfigurace:** Ujistěte se, že máte v src/environments/environment.ts správně nastavené své Firebase a API klíče.

### 3. Spuštění vývojového serveru
- **Pro spuštění aplikace v prohlížeči použijte:**
  ```bash
  ionic serve

### 4. Build a Deployment (Firebase)
- **Pro vytvoření produkční verze a nahrání na hosting:**
```bash
  ionic build --prod
  firebase deploy
