import {SceneScript} from './script';

/**
 * The Arabic narration (simple Modern Standard Arabic). Technical terms stay in English.
 *
 * It must have the same scenes, in the same order, with the same number of beats
 * as script.ts, because the scene files change the picture at the start of each beat.
 * `npm run voice -- --lang ar` reads `say`; captions show `caption`.
 */
export const scenesAr: SceneScript[] = [
  {
    id: 'intro',
    title: 'ماذا سنبني؟',
    beats: [
      {
        say: 'مرحبًا بكم! في هذا الفيديو سنبني تطبيق Android حقيقيًا، خطوة بخطوة، باستخدام Java و Firebase.',
        caption: 'نبني تطبيق Android باستخدام Java و Firebase',
      },
      {
        say: 'تطبيقنا هو صفحة إدارة للمطاعم. يستطيع المدير أن يضيف مطعمًا له اسم، ونوع، ووصف، وموقع، وشعار.',
        caption: 'تطبيق لإدارة المطاعم',
      },
      {
        say: 'ويستطيع المدير أيضًا أن يرى كل المطاعم في قائمة، وأن يعدّلها، وأن يحذفها.',
        caption: 'إضافة، عرض، تعديل، وحذف',
      },
      {
        say: 'هذه هي خطة التطبيق. لدينا Activity واحدة، اسمها MainActivity.',
        caption: 'Activity واحدة: MainActivity',
      },
      {
        say: 'بداخلها نعرض ثلاثة Fragments: الصفحة الرئيسية للمدير، وشاشة الإضافة، وشاشة العرض.',
        caption: 'ثلاثة Fragments',
      },
      {
        say: 'ولدينا أيضًا نافذتان من نوع Dialog: واحدة لتعديل المطعم، وأخرى لتأكيد الحذف.',
        caption: 'نافذتان من نوع Dialog',
      },
      {
        say: 'كل هذه الشاشات تتواصل مع Firebase من خلال كلاس مساعد واحد، اسمه FirebaseServices.',
        caption: 'كلاس مساعد واحد: FirebaseServices',
      },
      {
        say: 'و FirebaseServices يتواصل مع Firebase: خدمة تسجيل الدخول، وقاعدة بيانات Firestore، و Storage لحفظ الصور. هيا نبدأ!',
        caption: 'Firebase: تسجيل الدخول، Firestore، و Storage',
      },
    ],
  },
  {
    id: 'firebase-setup',
    title: 'إعداد Firebase',
    beats: [
      {
        say: 'أولًا، نحتاج إلى مشروع Firebase. و Firebase هي مجموعة أدوات من Google، تعطي تطبيقنا قاعدة بيانات ومساحة لحفظ الملفات على الإنترنت.',
        caption: 'Firebase = أدوات سحابية من Google',
      },
      {
        say: 'ادخل إلى Firebase console، واضغط على Add project، ثم اكتب اسمًا لمشروعك.',
        caption: 'الخطوة 1: Firebase console ثم Add project',
      },
      {
        say: 'بعد ذلك، أضف تطبيق Android إلى المشروع، واكتب اسم الحزمة الخاص بتطبيقك: com.example.restaurantadmin.',
        caption: 'الخطوة 2: أضف تطبيق Android',
      },
      {
        say: 'سيعطيك Firebase ملفًا اسمه google-services.json. ضعه داخل مجلد app في مشروعك.',
        caption: 'الخطوة 3: ضع google-services.json في مجلد app',
      },
      {
        say: 'الآن فعّل Firestore Database و Storage. ابدأ الاثنين في وضع الاختبار، أي test mode، حتى نستطيع القراءة والكتابة أثناء التعلّم.',
        caption: 'الخطوة 4: فعّل Firestore و Storage في test mode',
      },
      {
        say: 'وأخيرًا، أضف مكتبات Firebase إلى ملف build.gradle الخاص بالتطبيق. الـ BoM يختار لنا إصدارات متوافقة. ونضيف أيضًا مكتبة Glide لعرض الصور.',
        caption: 'الخطوة 5: أضف المكتبات إلى build.gradle',
      },
    ],
  },
  {
    id: 'model',
    title: 'كلاس Restaurant',
    beats: [
      {
        say: 'لنكتب الآن أول كلاس: Restaurant. هذا هو الـ model class، وهو يصف مطعمًا واحدًا.',
        caption: 'Restaurant هو الـ model class',
      },
      {
        say: 'فيه ستة حقول: id، و name، و type، و description، و location، و logoUrl. وكلها من نوع String.',
        caption: 'ستة حقول من نوع String',
      },
      {
        say: 'بعد ذلك، constructor فارغ. يبدو أنه لا يفعل شيئًا، لكن Firestore يحتاجه، ليعيد بناء الكائن عندما يقرأ document من قاعدة البيانات.',
        caption: 'constructor فارغ: يحتاجه Firestore',
      },
      {
        say: 'ثم constructor كامل، نستخدمه عندما ننشئ مطعمًا جديدًا.',
        caption: 'constructor كامل: لإنشاء مطعم جديد',
      },
      {
        say: 'وأخيرًا، getter و setter لكل حقل. يستخدمها Firestore لقراءة القيم وكتابتها.',
        caption: 'getter و setter لكل حقل',
      },
      {
        say: 'وشيء أخير: الكلاس يطبّق Serializable. هذا يسمح لنا بإرسال المطعم إلى نافذة الـ Dialog لاحقًا.',
        caption: 'implements Serializable',
      },
    ],
  },
  {
    id: 'singleton',
    title: 'FirebaseServices: الـ Lazy Singleton',
    beats: [
      {
        say: 'كل شاشة في تطبيقنا تحتاج إلى Firebase. يمكننا أن ننشئ كائنات Firebase من جديد في كل شاشة، لكن هناك طريقة أفضل: الـ Singleton.',
        caption: 'كل شاشة تحتاج إلى Firebase',
      },
      {
        say: 'الـ Singleton هو كلاس له كائن واحد فقط في التطبيق كله، والجميع يستخدم هذا الكائن نفسه.',
        caption: 'Singleton = كائن واحد فقط، يستخدمه الجميع',
      },
      {
        say: 'والـ Singleton عندنا من نوع Lazy أيضًا. ومعنى Lazy أننا لا ننشئ الكائن عند بدء التطبيق، بل ننشئه في أول مرة يطلبه فيها أحد.',
        caption: 'Lazy = ننشئه في أول مرة نحتاجه',
      },
      {
        say: 'لننظر إلى الكود. أولًا، حقل private static اسمه instance. قيمته في البداية null، لأننا لم ننشئ شيئًا بعد.',
        caption: 'instance يبدأ بقيمة null',
      },
      {
        say: 'ثم ثلاثة حقول: auth، و db، و storage. وهي أدوات Firebase الثلاث التي سنستخدمها.',
        caption: 'ثلاث أدوات من Firebase: auth و db و storage',
      },
      {
        say: 'الـ constructor هنا private. هذا يعني أن أي كلاس آخر لا يستطيع أن يكتب new FirebaseServices. وبداخله نحصل على كل أداة من أدوات Firebase.',
        caption: 'constructor من نوع private: لا أحد غيره يستطيع استخدام new',
      },
      {
        say: 'وهذا هو الجزء الأهم: getInstance. إذا كانت قيمة instance هي null، ننشئ الكائن. ثم نُرجع دائمًا الكائن نفسه.',
        caption: 'getInstance(): ننشئه مرة واحدة، ثم نعيد استخدامه',
      },
      {
        say: 'وأخيرًا، ثلاث دوال getter، حتى تستطيع الشاشات استخدام auth و db و storage.',
        caption: 'دوال getter لـ auth و db و storage',
      },
      {
        say: 'والآن، أي Fragment أو Dialog يستدعي FirebaseServices.getInstance فقط، وكلهم يحصلون على الكائن نفسه.',
        caption: 'كل شاشة تستدعي FirebaseServices.getInstance()',
      },
    ],
  },
  {
    id: 'main-activity',
    title: 'MainActivity والـ Fragments',
    beats: [
      {
        say: 'لننتقل إلى MainActivity، وهي صفحة المدير. فيها زرّان، Add و Show، وفيها FrameLayout. والـ FrameLayout هو حاوية فارغة نضع فيها Fragment.',
        caption: 'زرّان وحاوية FrameLayout',
      },
      {
        say: 'الـ Fragment هو جزء من الشاشة، له تصميمه الخاص وكوده الخاص. ويمكننا أن نبدّل الـ Fragments داخل الحاوية، كما نبدّل الشرائح في عرض تقديمي.',
        caption: 'الـ Fragment = جزء من الشاشة',
      },
      {
        say: 'في onCreate، نحدّد التصميم، ونجد الزرّين باستخدام findViewById.',
        caption: 'onCreate: نجد الزرّين',
      },
      {
        say: 'عندما نضغط Add، نعرض AddRestaurantFragment. وعندما نضغط Show، نعرض ShowRestaurantsFragment.',
        caption: 'Add ← AddRestaurantFragment، و Show ← ShowRestaurantsFragment',
      },
      {
        say: 'وعند فتح التطبيق لأول مرة، نعرض AdminFragment، وهي الصفحة الرئيسية.',
        caption: 'نبدأ بـ AdminFragment',
      },
      {
        say: 'الدالة showFragment هي التي تقوم بالتبديل. تبدأ transaction، ثم تستبدل ما في الحاوية بالـ Fragment الجديد، ثم تنفّذ commit.',
        caption: 'showFragment(): نستبدل ثم ننفّذ commit',
      },
      {
        say: 'لاحظوا: Add، ثم Show، ثم Add مرة أخرى. نفس الـ Activity، لكن Fragments مختلفة.',
        caption: 'نفس الـ Activity، و Fragments مختلفة',
      },
    ],
  },
  {
    id: 'add-fragment',
    title: 'شاشة الإضافة',
    beats: [
      {
        say: 'لننتقل إلى شاشة الإضافة. في تصميمها صورة نضغط عليها لاختيار الشعار، وأربعة حقول نصية، وزر Add.',
        caption: 'صورة للشعار، وأربعة حقول، وزر Add',
      },
      {
        say: 'في الكود، نحصل أولًا على كائن FirebaseServices، ونجد كل عناصر الشاشة.',
        caption: 'نحصل على FirebaseServices ونجد عناصر الشاشة',
      },
      {
        say: 'لاختيار صورة من المعرض، نستخدم registerForActivityResult مع GetContent. وعندما يختار المستخدم صورة، نحفظ الـ Uri الخاص بها ونعرضها.',
        caption: 'نختار صورة من المعرض',
      },
      {
        say: 'الضغط على الشعار يفتح المعرض، والضغط على Add يستدعي الدالة addRestaurant.',
        caption: 'الشعار ← المعرض، و Add ← addRestaurant()',
      },
      {
        say: 'في addRestaurant، نقرأ النص من كل حقل، ونتحقّق من النموذج. إذا كان هناك شيء ناقص، نعرض Toast ونتوقّف.',
        caption: 'نقرأ الحقول ونتحقّق من النموذج',
      },
      {
        say: 'بعد ذلك، ننشئ document جديدًا وفارغًا في مجموعة restaurants. وهذا يعطينا id فريدًا.',
        caption: 'الـ document الجديد يعطينا id فريدًا',
      },
      {
        say: 'نستخدم هذا الـ id لتسمية ملف الشعار في Storage، داخل مجلد اسمه logos.',
        caption: 'ملف الشعار: logos/<id>.jpg',
      },
      {
        say: 'الخطوة الأولى: نرفع الصورة باستخدام putFile. الخطوة الثانية: عندما ينجح الرفع، نطلب رابط التحميل، وهو رابط للصورة على الإنترنت.',
        caption: 'نرفع الصورة، ثم نحصل على رابطها',
      },
      {
        say: 'الخطوة الثالثة، في saveRestaurant: ننشئ كائن Restaurant فيه الـ id والنصوص ورابط الشعار، ونحفظه في Firestore باستخدام set.',
        caption: 'ننشئ Restaurant ونحفظه باستخدام set()',
      },
      {
        say: 'إذا نجح الحفظ، نعرض Toast، وننتقل إلى شاشة العرض. وإذا فشل أي شيء، تعرض الدالة showError رسالة Toast فيها المشكلة.',
        caption: 'النجاح ← شاشة العرض، والفشل ← رسالة خطأ',
      },
    ],
  },
  {
    id: 'show-fragment',
    title: 'شاشة العرض والـ RecyclerView',
    beats: [
      {
        say: 'ننتقل الآن إلى شاشة العرض. وهي تعرض كل المطاعم في RecyclerView.',
        caption: 'قائمة المطاعم في RecyclerView',
      },
      {
        say: 'الـ RecyclerView ذكي. فهو ينشئ فقط عدد الصفوف الذي يملأ الشاشة. وعندما نمرّر القائمة، يعيد استخدام الصفوف القديمة لبيانات جديدة. ولهذا اسمه RecyclerView.',
        caption: 'الصفوف يُعاد استخدامها عند التمرير',
      },
      {
        say: 'الـ RecyclerView يحتاج إلى ثلاثة أشياء: تصميم لصف واحد، و Adapter، و ViewHolder.',
        caption: 'تصميم الصف + Adapter + ViewHolder',
      },
      {
        say: 'الـ ViewHolder يحفظ عناصر صف واحد: الشعار، والاسم، والنوع، والموقع، والزرّين. ونجدها مرة واحدة فقط.',
        caption: 'ViewHolder: عناصر صف واحد',
      },
      {
        say: 'الـ Adapter فيه ثلاث دوال. الدالة onCreateViewHolder تنشئ صفًا جديدًا من تصميم الصف.',
        caption: 'onCreateViewHolder: تنشئ صفًا',
      },
      {
        say: 'والدالة onBindViewHolder تملأ الصف ببيانات مطعم واحد. نضع النصوص، ونستخدم Glide لتحميل الشعار وعرضه.',
        caption: 'onBindViewHolder: تملأ الصف',
      },
      {
        say: 'والدالة getItemCount تخبر الـ RecyclerView بعدد الصفوف.',
        caption: 'getItemCount: عدد الصفوف',
      },
      {
        say: 'وعند الضغط على زر، يخبر الـ Adapter الـ Fragment بذلك، من خلال interface صغيرة فيها دالتان: onUpdateClick و onDeleteClick.',
        caption: 'الـ interface تخبر الـ Fragment بالضغطات',
      },
      {
        say: 'وفي الـ Fragment، تقرأ الدالة loadRestaurants كل الـ documents في مجموعة restaurants. والدالة toObject تحوّل كل document إلى كائن Restaurant.',
        caption: 'loadRestaurants(): القراءة من Firestore',
      },
      {
        say: 'ثم نستدعي notifyDataSetChanged، فتُرسم القائمة من جديد.',
        caption: 'notifyDataSetChanged(): نعيد رسم القائمة',
      },
    ],
  },
  {
    id: 'update-dialog',
    title: 'نافذة التعديل',
    beats: [
      {
        say: 'لنعدّل مطعمًا. عندما يضغط المستخدم Update، يفتح الـ Fragment نافذة EditRestaurantDialog.',
        caption: 'زر Update يفتح EditRestaurantDialog',
      },
      {
        say: 'ننشئ النافذة باستخدام newInstance. وهي تضع المطعم داخل Bundle، كـ arguments للنافذة. ولهذا السبب جعلنا Restaurant من نوع Serializable.',
        caption: 'newInstance(): نضع المطعم داخل Bundle',
      },
      {
        say: 'في onViewCreated، نأخذ المطعم من الـ arguments، ونملأ كل حقل بقيمته الحالية.',
        caption: 'نملأ الحقول بالقيم الحالية',
      },
      {
        say: 'عندما يضغط المستخدم Save، ننسخ القيم الجديدة إلى كائن المطعم.',
        caption: 'Save: ننسخ القيم الجديدة',
      },
      {
        say: 'ثم نحفظه في Firestore باستخدام set. نستخدم نفس الـ id، لذلك تحلّ البيانات الجديدة محلّ القديمة.',
        caption: 'set() مع نفس الـ id تستبدل البيانات القديمة',
      },
      {
        say: 'وعندما ينجح الحفظ، نستدعي onSaved، فتعيد شاشة العرض تحميل القائمة، ثم نغلق النافذة.',
        caption: 'نحدّث القائمة ونغلق النافذة',
      },
    ],
  },
  {
    id: 'delete-dialog',
    title: 'نافذة تأكيد الحذف',
    beats: [
      {
        say: 'الحذف لا يمكن التراجع عنه، لذلك نسأل أولًا. عندما يضغط المستخدم Delete، نعرض AlertDialog.',
        caption: 'نسأل قبل الحذف',
      },
      {
        say: 'نعطيها عنوانًا ورسالة: هل أنت متأكد؟ ثم نضيف زرّين.',
        caption: 'عنوان، ورسالة، وزرّان',
      },
      {
        say: 'إذا ضغط المستخدم No، لا يحدث شيء، وتُغلق النافذة فقط.',
        caption: 'No ← لا يحدث شيء',
      },
      {
        say: 'وإذا ضغط Yes، نستدعي deleteRestaurant. وهي تجد الـ document باستخدام الـ id الخاص به، وتحذفه.',
        caption: 'Yes ← نحذف الـ document باستخدام الـ id',
      },
      {
        say: 'ثم نعرض Toast ونحمّل القائمة من جديد، فيختفي المطعم.',
        caption: 'نعرض Toast ونعيد تحميل القائمة',
      },
    ],
  },
  {
    id: 'demo',
    title: 'التطبيق كاملًا',
    beats: [
      {
        say: 'والآن، لنشاهد التطبيق كله وهو يعمل معًا.',
        caption: 'التطبيق كاملًا',
      },
      {
        say: 'نفتح التطبيق فنرى صفحة المدير. نضغط على Add a restaurant.',
        caption: 'صفحة المدير ← Add a restaurant',
      },
      {
        say: 'نختار شعارًا، ونكتب الاسم، والنوع، والوصف، والموقع، ثم نضغط Add.',
        caption: 'نملأ النموذج ونضغط Add',
      },
      {
        say: 'يُرفع الشعار إلى Storage، ويُحفظ المطعم في Firestore، ثم نراه في القائمة.',
        caption: 'Storage ← Firestore ← القائمة',
      },
      {
        say: 'لنضغط Update، ونغيّر الموقع، ثم نحفظ. القائمة تعرض الموقع الجديد.',
        caption: 'نعدّل الموقع',
      },
      {
        say: 'والآن، Delete. هل أنت متأكد؟ نعم. وقد اختفى.',
        caption: 'Delete ← Yes ← اختفى',
      },
    ],
  },
  {
    id: 'summary',
    title: 'الخلاصة',
    beats: [
      {
        say: 'أحسنتم! لنراجع ما بنيناه.',
        caption: 'ماذا بنينا؟',
      },
      {
        say: 'كلاس Restaurant، وهو model يستطيع Firestore قراءته وكتابته.',
        caption: 'model class يعمل مع Firestore',
      },
      {
        say: 'و FirebaseServices، وهو Lazy Singleton تشترك فيه كل الشاشات.',
        caption: 'Lazy Singleton لـ Firebase',
      },
      {
        say: 'و Activity واحدة تبدّل بين ثلاثة Fragments، ونافذتان للتعديل والحذف.',
        caption: 'Activity واحدة، وثلاثة Fragments، ونافذتان',
      },
      {
        say: 'رفعنا الصور إلى Storage، وحفظنا البيانات في Firestore، وعرضناها كلها في RecyclerView.',
        caption: 'Storage و Firestore و RecyclerView',
      },
      {
        say: 'الكود الكامل موجود في مجلد android-app. افتحه في Android Studio، وأضف ملف google-services.json الخاص بك، وجرّبه بنفسك. إلى اللقاء!',
        caption: 'خذ الكود الكامل وجرّبه بنفسك!',
      },
    ],
  },
];
