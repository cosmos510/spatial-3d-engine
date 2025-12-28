# Spatial 3D Engine - Version Web

Version WebGL/Three.js du moteur 3D avec éclairage dynamique et ombres.

## 🚀 Lancement Local

```bash
cd web
python3 -m http.server 8000
# Ouvrir http://localhost:8000
```

## 🌐 Déploiement

### GitHub Pages
```bash
git add web/
git commit -m "Add WebGL version"
git push origin main
# Activer GitHub Pages sur le dossier /web
```

### Vercel (Recommandé)
```bash
npm install -g vercel
cd web
vercel --prod
```

### Netlify
```bash
# Glisser-déposer le dossier web/ sur netlify.com
```

## 🎮 Contrôles

- **Clic + glisser** : Rotation caméra
- **Molette** : Zoom
- **R** : Reset caméra  
- **L** : Toggle éclairage

## 🔧 Fonctionnalités

✅ Éclairage dynamique (2 sources)  
✅ Ombres en temps réel  
✅ Contrôles souris intuitifs  
✅ Animation automatique  
✅ Stats de performance  
✅ Responsive design  

## 📊 Performance

- **60 FPS** stable
- **Ombres PCF** haute qualité
- **2048x2048** shadow maps
- Compatible **mobile/desktop**

## 🎯 Prêt pour Production

Cette version est optimisée pour :
- Démos clients
- Pitch investisseurs  
- Tests utilisateurs
- Intégration web