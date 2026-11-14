/* =========================================================
   IELTS Pro — RÉGLAGES (à modifier par Solvarynlabs)
   ========================================================= */
const PREMIUM_CONFIG = {
  // Prix affiché sur la page Premium
  price: 5000,
  currency: "DA",
  priceNote: "one payment",

  // Compte marchand SofizPay : ton adresse PUBLIQUE (commence par G). Elle peut être publiée sans risque.
  // Ne mets JAMAIS ici une clé secrète (qui commence par S).
  sofizpayAccount: "GCBOEMS52WXFD2IC2YUJVQI74TTP3RBETE74TM6ZHGQL3R4B43RMMMKI",
  // Adresse SofizPay qui crée le paiement par carte CIB / Edahabia (d'après le kit officiel sofizpay-sdk-js).
  sofizpayEndpoint: "https://www.sofizpay.com/make-cib-transaction/",

  // (Optionnel) lien de paiement créé à la main dans ton espace SofizPay, utilisé seulement si le compte est vide.
  sofizpayLink: "",

  // Contact pour envoyer le reçu et les corrections (laisse vide si tu ne veux pas l afficher).
  // WhatsApp : numéro au format international sans + ni espaces, ex. "213XXXXXXXXX"
  whatsapp: "",
  // E-mail du professeur ou de Solvarynlabs
  email: "",

  // Empreintes SHA-256 des codes d activation (les codes eux-mêmes sont dans premium-codes-PRIVE.txt, jamais publié).
  codeHashes: ["f01aa3ec6e0b11b516910e1b1304d00e7b14f4d8da6f52588bb4d474846d6a63","64028e404d676de33ba3967a501e82ee4c7c1cdd5666f22fe90fee57b738c930","3576b3a8272c314bb640a1a11729ffa2b22e5016170d3e7e9234bc2db0aa2ba1","992cb64cc1793ec409a7676170f292929f9572cbefce3e17056fbae9c4f9a043","968f5a71458cb33fdf1d0ce9f07820ef69ecd6d1268b30a914a113ca306f0d15","cf8f8334f3068226793b40ec61453a1f712f27e5aa140f59fa5984c81f49314d","850226225bea6fbffd1e23a87be1cb297d481ec0b8938ca8fb38182ef87d1ecd","2578836ceea101f4c4671d319305a78b6a63f19edaae9e63d62bc17e726b8ec2","fb767c2cfe8e1a9482c06baef13a07fece20d5e04ce64731a26ca2cfd4b73432","c217ab6690eced001cfd05057ca825ee925d74ef4cbf0548c166362c4c171da8","2ea28a862c9f112f82d9fb87153c9307c3aeed4927cc7df770565fd109b04842","d64be6bd9d107536433aaa818e9bec899bb59bddb787b689dea7755d7df30e97","eabf1ad8e038c80599d98229cbf388c3c65e4ddf1ccde44b311af7e3d1df4cc6","2a631e0f8c1cf4782e1a69a035382c92f5b373b345c003207b854c6900b18989","31eaed8a3e35724beb59ff3f571c33a4484d658fafff1ad4874a97aee9111f83","8810470c31435e0710cf94ba388a67568861e0bbe2a7820f437872586a766abe","ec62ea6c5b70ee4a0ba56a2309222a4105cc60e2a30d9fdcab101664c64111c5","e9de54c5d96e604a27a3c29f583bf7275ffdd8b6af0cc9102b3698988019ac1a","78d61552f7da56c4c90705ac6e3984bfd38fccdbd77f64708aad70430a55bcc9","e98ef15fd0dc6e373371cf3e8a8997cfb351695c96e1194c68750e24dfa34fba","8f34a459c9217a206dbf54d3b5ae62dbc758322fef9e923abe263b28968348d8","b5fd80375b3a899abc3e823e6fd68c33dfece064a3f148358e1a71f11e0170db","0c0cf53b30049d24bcc1a464473ffedb89b83cc8da3dd228e3bfa4e70aab4718","e685aa47d5ad14912f09da531b81502d98887dd0d002e40146e538cd1024f3c8","ce4a843f71258f31d8bfa76c55b980ca5ecc81677fb5b951dfc262dec7071af0","f378efd85f3a2466f3dd837612363feb9ea71df152f85c7d98cb5c2cefd54f96","38e1825eeb1a2fe3c96dc8be3e06ea373e4a5fd3bcaa72824485745485f74c0a","70056b530337c5889fdf55f2eaa03f21d9c7fd690893c0c815705044cb638a01","0582e06f20f2ac045722c658705c130c4efdac056d4f5e719b41653ffc2844a0","0f180d5614fa2ed528c613aeef910e21126889d3c471f48fe3523e86c985eb2b","3569cc3e26ed93e4dac370885e86dab9af181bc3c0e3006e9fbdf3f437ae1d8e","874108fe56d03c726e41735c68eb5748ca0af0dadfce400f8121850e76d3caad","24ae7768aba953727efc2d3bebf031cf9c595fb11ef1075ca723078368cbf0e1","1d86d88de003d2e14b6a1882aff7acd1e41770d45ac4bf191ce7859328318ba4","d95ddb203eec9402ee353497330b3c29ddab60d276d925c0031361213361f8c5","c0f03ca2882550bd2fc61501fa3eb130e9a56483d5c8bf30dd8819befa17bec4","b000f595eb58050f85e6c06f670f5702bf5c71fce2f236c4de327e94d2dd80b6","c1e1fa13418f18eeafc189d0ce9645edbcc6562f4f4510003563978ec6be42ee","ff8c02ef517755fc7775cf09651d375fa3d1d8b4f23562e25bc973e18dd751b1","5b4b51f30eb877a3202c4c4a1b8970caafab767eb09cd78a903544b9245efa9e","e5d8b938fc124e922a4b32b5af57faaecfeb2e82d915a9faaabfbbd7a4ee0a7c","5e4d010a3e5492ebe3c243ae60bedb1fc17969c051ac2cf352e4032677666377","3ee4980279c0f3ac1290a2135d92218935cac9487501a75a008fea66a79fa404","982024733e8a305516f2eaa1265894c85fc7a6e4791c1ebf77ebca56e1e2290c","81015b4fa40dacd3d87106515f954a3714cb87f67ecae7a134f8dd093e31bb7b","1ce084bbc6bfd58e852e3ba3be5fb83e009028a3f5fd53d5d417d914126cc418","623be55f9183e7351acdd2255207f8bcc5698a1e75f7d2cf2c441c8be3378d7b","f1caefb20a3f04d9ba17fd2c9aa1fffa3ff04368a087e6fe964d63af7a01ba99","bbb3013e54a705d95578f4a30f89619c8cb2e8331113a7fe2e4424825b3bc9a1","4f5e6ac6be555719caea16858c162e73bc43b014120207da2636d68c85b93570"]
};
