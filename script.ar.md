# Narration script (Arabic): Build an Android app with Java and Firebase

<!-- This file is made by `npm run script` (in /video) from video/src/script.ar.ts. Edit that file, not this one. -->

Total length: **9:57** · 11 scenes · 1116 words

All timings come from the audio files in `video/public/audio/ar/`.

**Recording tips:** record one file per scene (`scene01.mp3`, `scene02.mp3`, ...) and read the lines in order (the *On screen* captions are not read). Speak slowly and clearly. Leave a short pause between lines. The video stretches each scene to fit your recording.

## Scenes

| # | Scene | Starts | Length | Audio file |
| --- | --- | --- | --- | --- |
| 1 | ماذا سنبني؟ | 0:00 | 0:57 | `ar/scene01.mp3` |
| 2 | إعداد Firebase | 0:57 | 0:56 | `ar/scene02.mp3` |
| 3 | كلاس Restaurant | 1:53 | 0:41 | `ar/scene03.mp3` |
| 4 | FirebaseServices: الـ Lazy Singleton | 2:35 | 1:20 | `ar/scene04.mp3` |
| 5 | MainActivity والـ Fragments | 3:55 | 0:59 | `ar/scene05.mp3` |
| 6 | شاشة الإضافة | 4:53 | 1:22 | `ar/scene06.mp3` |
| 7 | شاشة العرض والـ RecyclerView | 6:15 | 1:19 | `ar/scene07.mp3` |
| 8 | نافذة التعديل | 7:34 | 0:46 | `ar/scene08.mp3` |
| 9 | نافذة تأكيد الحذف | 8:20 | 0:30 | `ar/scene09.mp3` |
| 10 | التطبيق كاملًا | 8:49 | 0:29 | `ar/scene10.mp3` |
| 11 | الخلاصة | 9:19 | 0:38 | `ar/scene11.mp3` |

## Scene 1: ماذا سنبني؟

Starts at 0:00 · length 0:57 · file `ar/scene01.mp3`

**[0:00]** مرحبًا بكم! في هذا الفيديو سنبني تطبيق Android حقيقيًا، خطوة بخطوة، باستخدام Java و Firebase.

> On screen: *نبني تطبيق Android باستخدام Java و Firebase*

**[0:08]** تطبيقنا هو صفحة إدارة للمطاعم. يستطيع المدير أن يضيف مطعمًا له اسم، ونوع، ووصف، وموقع، وشعار.

> On screen: *تطبيق لإدارة المطاعم*

**[0:17]** ويستطيع المدير أيضًا أن يرى كل المطاعم في قائمة، وأن يعدّلها، وأن يحذفها.

> On screen: *إضافة، عرض، تعديل، وحذف*

**[0:23]** هذه هي خطة التطبيق. لدينا Activity واحدة، اسمها MainActivity.

> On screen: *Activity واحدة: MainActivity*

**[0:28]** بداخلها نعرض ثلاثة Fragments: الصفحة الرئيسية للمدير، وشاشة الإضافة، وشاشة العرض.

> On screen: *ثلاثة Fragments*

**[0:34]** ولدينا أيضًا نافذتان من نوع Dialog: واحدة لتعديل المطعم، وأخرى لتأكيد الحذف.

> On screen: *نافذتان من نوع Dialog*

**[0:40]** كل هذه الشاشات تتواصل مع Firebase من خلال كلاس مساعد واحد، اسمه FirebaseServices.

> On screen: *كلاس مساعد واحد: FirebaseServices*

**[0:47]** و FirebaseServices يتواصل مع Firebase: خدمة تسجيل الدخول، وقاعدة بيانات Firestore، و Storage لحفظ الصور. هيا نبدأ!

> On screen: *Firebase: تسجيل الدخول، Firestore، و Storage*


## Scene 2: إعداد Firebase

Starts at 0:57 · length 0:56 · file `ar/scene02.mp3`

**[0:57]** أولًا، نحتاج إلى مشروع Firebase. و Firebase هي مجموعة أدوات من Google، تعطي تطبيقنا قاعدة بيانات ومساحة لحفظ الملفات على الإنترنت.

> On screen: *Firebase = أدوات سحابية من Google*

**[1:09]** ادخل إلى Firebase console، واضغط على Add project، ثم اكتب اسمًا لمشروعك.

> On screen: *الخطوة 1: Firebase console ثم Add project*

**[1:16]** بعد ذلك، أضف تطبيق Android إلى المشروع، واكتب اسم الحزمة الخاص بتطبيقك: com.example.restaurantadmin.

> On screen: *الخطوة 2: أضف تطبيق Android*

**[1:23]** سيعطيك Firebase ملفًا اسمه google-services.json. ضعه داخل مجلد app في مشروعك.

> On screen: *الخطوة 3: ضع google-services.json في مجلد app*

**[1:29]** الآن فعّل Firestore Database و Storage. ابدأ الاثنين في وضع الاختبار، أي test mode، حتى نستطيع القراءة والكتابة أثناء التعلّم.

> On screen: *الخطوة 4: فعّل Firestore و Storage في test mode*

**[1:41]** وأخيرًا، أضف مكتبات Firebase إلى ملف build.gradle الخاص بالتطبيق. الـ BoM يختار لنا إصدارات متوافقة. ونضيف أيضًا مكتبة Glide لعرض الصور.

> On screen: *الخطوة 5: أضف المكتبات إلى build.gradle*


## Scene 3: كلاس Restaurant

Starts at 1:53 · length 0:41 · file `ar/scene03.mp3`

**[1:54]** لنكتب الآن أول كلاس: Restaurant. هذا هو الـ model class، وهو يصف مطعمًا واحدًا.

> On screen: *Restaurant هو الـ model class*

**[2:00]** فيه ستة حقول: id، و name، و type، و description، و location، و logoUrl. وكلها من نوع String.

> On screen: *ستة حقول من نوع String*

**[2:08]** بعد ذلك، constructor فارغ. يبدو أنه لا يفعل شيئًا، لكن Firestore يحتاجه، ليعيد بناء الكائن عندما يقرأ document من قاعدة البيانات.

> On screen: *constructor فارغ: يحتاجه Firestore*

**[2:18]** ثم constructor كامل، نستخدمه عندما ننشئ مطعمًا جديدًا.

> On screen: *constructor كامل: لإنشاء مطعم جديد*

**[2:22]** وأخيرًا، getter و setter لكل حقل. يستخدمها Firestore لقراءة القيم وكتابتها.

> On screen: *getter و setter لكل حقل*

**[2:27]** وشيء أخير: الكلاس يطبّق Serializable. هذا يسمح لنا بإرسال المطعم إلى نافذة الـ Dialog لاحقًا.

> On screen: *implements Serializable*


## Scene 4: FirebaseServices: الـ Lazy Singleton

Starts at 2:35 · length 1:20 · file `ar/scene04.mp3`

**[2:35]** كل شاشة في تطبيقنا تحتاج إلى Firebase. يمكننا أن ننشئ كائنات Firebase من جديد في كل شاشة، لكن هناك طريقة أفضل: الـ Singleton.

> On screen: *كل شاشة تحتاج إلى Firebase*

**[2:46]** الـ Singleton هو كلاس له كائن واحد فقط في التطبيق كله، والجميع يستخدم هذا الكائن نفسه.

> On screen: *Singleton = كائن واحد فقط، يستخدمه الجميع*

**[2:54]** والـ Singleton عندنا من نوع Lazy أيضًا. ومعنى Lazy أننا لا ننشئ الكائن عند بدء التطبيق، بل ننشئه في أول مرة يطلبه فيها أحد.

> On screen: *Lazy = ننشئه في أول مرة نحتاجه*

**[3:05]** لننظر إلى الكود. أولًا، حقل private static اسمه instance. قيمته في البداية null، لأننا لم ننشئ شيئًا بعد.

> On screen: *instance يبدأ بقيمة null*

**[3:14]** ثم ثلاثة حقول: auth، و db، و storage. وهي أدوات Firebase الثلاث التي سنستخدمها.

> On screen: *ثلاث أدوات من Firebase: auth و db و storage*

**[3:21]** الـ constructor هنا private. هذا يعني أن أي كلاس آخر لا يستطيع أن يكتب new FirebaseServices. وبداخله نحصل على كل أداة من أدوات Firebase.

> On screen: *constructor من نوع private: لا أحد غيره يستطيع استخدام new*

**[3:32]** وهذا هو الجزء الأهم: getInstance. إذا كانت قيمة instance هي null، ننشئ الكائن. ثم نُرجع دائمًا الكائن نفسه.

> On screen: *getInstance(): ننشئه مرة واحدة، ثم نعيد استخدامه*

**[3:41]** وأخيرًا، ثلاث دوال getter، حتى تستطيع الشاشات استخدام auth و db و storage.

> On screen: *دوال getter لـ auth و db و storage*

**[3:47]** والآن، أي Fragment أو Dialog يستدعي FirebaseServices.getInstance فقط، وكلهم يحصلون على الكائن نفسه.

> On screen: *كل شاشة تستدعي FirebaseServices.getInstance()*


## Scene 5: MainActivity والـ Fragments

Starts at 3:55 · length 0:59 · file `ar/scene05.mp3`

**[3:55]** لننتقل إلى MainActivity، وهي صفحة المدير. فيها زرّان، Add و Show، وفيها FrameLayout. والـ FrameLayout هو حاوية فارغة نضع فيها Fragment.

> On screen: *زرّان وحاوية FrameLayout*

**[4:06]** الـ Fragment هو جزء من الشاشة، له تصميمه الخاص وكوده الخاص. ويمكننا أن نبدّل الـ Fragments داخل الحاوية، كما نبدّل الشرائح في عرض تقديمي.

> On screen: *الـ Fragment = جزء من الشاشة*

**[4:19]** في onCreate، نحدّد التصميم، ونجد الزرّين باستخدام findViewById.

> On screen: *onCreate: نجد الزرّين*

**[4:24]** عندما نضغط Add، نعرض AddRestaurantFragment. وعندما نضغط Show، نعرض ShowRestaurantsFragment.

> On screen: *Add ← AddRestaurantFragment، و Show ← ShowRestaurantsFragment*

**[4:29]** وعند فتح التطبيق لأول مرة، نعرض AdminFragment، وهي الصفحة الرئيسية.

> On screen: *نبدأ بـ AdminFragment*

**[4:34]** الدالة showFragment هي التي تقوم بالتبديل. تبدأ transaction، ثم تستبدل ما في الحاوية بالـ Fragment الجديد، ثم تنفّذ commit.

> On screen: *showFragment(): نستبدل ثم ننفّذ commit*

**[4:45]** لاحظوا: Add، ثم Show، ثم Add مرة أخرى. نفس الـ Activity، لكن Fragments مختلفة.

> On screen: *نفس الـ Activity، و Fragments مختلفة*


## Scene 6: شاشة الإضافة

Starts at 4:53 · length 1:22 · file `ar/scene06.mp3`

**[4:54]** لننتقل إلى شاشة الإضافة. في تصميمها صورة نضغط عليها لاختيار الشعار، وأربعة حقول نصية، وزر Add.

> On screen: *صورة للشعار، وأربعة حقول، وزر Add*

**[5:02]** في الكود، نحصل أولًا على كائن FirebaseServices، ونجد كل عناصر الشاشة.

> On screen: *نحصل على FirebaseServices ونجد عناصر الشاشة*

**[5:07]** لاختيار صورة من المعرض، نستخدم registerForActivityResult مع GetContent. وعندما يختار المستخدم صورة، نحفظ الـ Uri الخاص بها ونعرضها.

> On screen: *نختار صورة من المعرض*

**[5:17]** الضغط على الشعار يفتح المعرض، والضغط على Add يستدعي الدالة addRestaurant.

> On screen: *الشعار ← المعرض، و Add ← addRestaurant()*

**[5:22]** في addRestaurant، نقرأ النص من كل حقل، ونتحقّق من النموذج. إذا كان هناك شيء ناقص، نعرض Toast ونتوقّف.

> On screen: *نقرأ الحقول ونتحقّق من النموذج*

**[5:31]** بعد ذلك، ننشئ document جديدًا وفارغًا في مجموعة restaurants. وهذا يعطينا id فريدًا.

> On screen: *الـ document الجديد يعطينا id فريدًا*

**[5:38]** نستخدم هذا الـ id لتسمية ملف الشعار في Storage، داخل مجلد اسمه logos.

> On screen: *ملف الشعار: logos/<id>.jpg*

**[5:45]** الخطوة الأولى: نرفع الصورة باستخدام putFile. الخطوة الثانية: عندما ينجح الرفع، نطلب رابط التحميل، وهو رابط للصورة على الإنترنت.

> On screen: *نرفع الصورة، ثم نحصل على رابطها*

**[5:54]** الخطوة الثالثة، في saveRestaurant: ننشئ كائن Restaurant فيه الـ id والنصوص ورابط الشعار، ونحفظه في Firestore باستخدام set.

> On screen: *ننشئ Restaurant ونحفظه باستخدام set()*

**[6:04]** إذا نجح الحفظ، نعرض Toast، وننتقل إلى شاشة العرض. وإذا فشل أي شيء، تعرض الدالة showError رسالة Toast فيها المشكلة.

> On screen: *النجاح ← شاشة العرض، والفشل ← رسالة خطأ*


## Scene 7: شاشة العرض والـ RecyclerView

Starts at 6:15 · length 1:19 · file `ar/scene07.mp3`

**[6:15]** ننتقل الآن إلى شاشة العرض. وهي تعرض كل المطاعم في RecyclerView.

> On screen: *قائمة المطاعم في RecyclerView*

**[6:21]** الـ RecyclerView ذكي. فهو ينشئ فقط عدد الصفوف الذي يملأ الشاشة. وعندما نمرّر القائمة، يعيد استخدام الصفوف القديمة لبيانات جديدة. ولهذا اسمه RecyclerView.

> On screen: *الصفوف يُعاد استخدامها عند التمرير*

**[6:34]** الـ RecyclerView يحتاج إلى ثلاثة أشياء: تصميم لصف واحد، و Adapter، و ViewHolder.

> On screen: *تصميم الصف + Adapter + ViewHolder*

**[6:41]** الـ ViewHolder يحفظ عناصر صف واحد: الشعار، والاسم، والنوع، والموقع، والزرّين. ونجدها مرة واحدة فقط.

> On screen: *ViewHolder: عناصر صف واحد*

**[6:49]** الـ Adapter فيه ثلاث دوال. الدالة onCreateViewHolder تنشئ صفًا جديدًا من تصميم الصف.

> On screen: *onCreateViewHolder: تنشئ صفًا*

**[6:56]** والدالة onBindViewHolder تملأ الصف ببيانات مطعم واحد. نضع النصوص، ونستخدم Glide لتحميل الشعار وعرضه.

> On screen: *onBindViewHolder: تملأ الصف*

**[7:04]** والدالة getItemCount تخبر الـ RecyclerView بعدد الصفوف.

> On screen: *getItemCount: عدد الصفوف*

**[7:08]** وعند الضغط على زر، يخبر الـ Adapter الـ Fragment بذلك، من خلال interface صغيرة فيها دالتان: onUpdateClick و onDeleteClick.

> On screen: *الـ interface تخبر الـ Fragment بالضغطات*

**[7:18]** وفي الـ Fragment، تقرأ الدالة loadRestaurants كل الـ documents في مجموعة restaurants. والدالة toObject تحوّل كل document إلى كائن Restaurant.

> On screen: *loadRestaurants(): القراءة من Firestore*

**[7:29]** ثم نستدعي notifyDataSetChanged، فتُرسم القائمة من جديد.

> On screen: *notifyDataSetChanged(): نعيد رسم القائمة*


## Scene 8: نافذة التعديل

Starts at 7:34 · length 0:46 · file `ar/scene08.mp3`

**[7:34]** لنعدّل مطعمًا. عندما يضغط المستخدم Update، يفتح الـ Fragment نافذة EditRestaurantDialog.

> On screen: *زر Update يفتح EditRestaurantDialog*

**[7:40]** ننشئ النافذة باستخدام newInstance. وهي تضع المطعم داخل Bundle، كـ arguments للنافذة. ولهذا السبب جعلنا Restaurant من نوع Serializable.

> On screen: *newInstance(): نضع المطعم داخل Bundle*

**[7:51]** في onViewCreated، نأخذ المطعم من الـ arguments، ونملأ كل حقل بقيمته الحالية.

> On screen: *نملأ الحقول بالقيم الحالية*

**[7:57]** عندما يضغط المستخدم Save، ننسخ القيم الجديدة إلى كائن المطعم.

> On screen: *Save: ننسخ القيم الجديدة*

**[8:03]** ثم نحفظه في Firestore باستخدام set. نستخدم نفس الـ id، لذلك تحلّ البيانات الجديدة محلّ القديمة.

> On screen: *set() مع نفس الـ id تستبدل البيانات القديمة*

**[8:11]** وعندما ينجح الحفظ، نستدعي onSaved، فتعيد شاشة العرض تحميل القائمة، ثم نغلق النافذة.

> On screen: *نحدّث القائمة ونغلق النافذة*


## Scene 9: نافذة تأكيد الحذف

Starts at 8:20 · length 0:30 · file `ar/scene09.mp3`

**[8:20]** الحذف لا يمكن التراجع عنه، لذلك نسأل أولًا. عندما يضغط المستخدم Delete، نعرض AlertDialog.

> On screen: *نسأل قبل الحذف*

**[8:27]** نعطيها عنوانًا ورسالة: هل أنت متأكد؟ ثم نضيف زرّين.

> On screen: *عنوان، ورسالة، وزرّان*

**[8:31]** إذا ضغط المستخدم No، لا يحدث شيء، وتُغلق النافذة فقط.

> On screen: *No ← لا يحدث شيء*

**[8:36]** وإذا ضغط Yes، نستدعي deleteRestaurant. وهي تجد الـ document باستخدام الـ id الخاص به، وتحذفه.

> On screen: *Yes ← نحذف الـ document باستخدام الـ id*

**[8:44]** ثم نعرض Toast ونحمّل القائمة من جديد، فيختفي المطعم.

> On screen: *نعرض Toast ونعيد تحميل القائمة*


## Scene 10: التطبيق كاملًا

Starts at 8:49 · length 0:29 · file `ar/scene10.mp3`

**[8:50]** والآن، لنشاهد التطبيق كله وهو يعمل معًا.

> On screen: *التطبيق كاملًا*

**[8:53]** نفتح التطبيق فنرى صفحة المدير. نضغط على Add a restaurant.

> On screen: *صفحة المدير ← Add a restaurant*

**[8:58]** نختار شعارًا، ونكتب الاسم، والنوع، والوصف، والموقع، ثم نضغط Add.

> On screen: *نملأ النموذج ونضغط Add*

**[9:03]** يُرفع الشعار إلى Storage، ويُحفظ المطعم في Firestore، ثم نراه في القائمة.

> On screen: *Storage ← Firestore ← القائمة*

**[9:09]** لنضغط Update، ونغيّر الموقع، ثم نحفظ. القائمة تعرض الموقع الجديد.

> On screen: *نعدّل الموقع*

**[9:14]** والآن، Delete. هل أنت متأكد؟ نعم. وقد اختفى.

> On screen: *Delete ← Yes ← اختفى*


## Scene 11: الخلاصة

Starts at 9:19 · length 0:38 · file `ar/scene11.mp3`

**[9:19]** أحسنتم! لنراجع ما بنيناه.

> On screen: *ماذا بنينا؟*

**[9:21]** كلاس Restaurant، وهو model يستطيع Firestore قراءته وكتابته.

> On screen: *model class يعمل مع Firestore*

**[9:26]** و FirebaseServices، وهو Lazy Singleton تشترك فيه كل الشاشات.

> On screen: *Lazy Singleton لـ Firebase*

**[9:31]** و Activity واحدة تبدّل بين ثلاثة Fragments، ونافذتان للتعديل والحذف.

> On screen: *Activity واحدة، وثلاثة Fragments، ونافذتان*

**[9:37]** رفعنا الصور إلى Storage، وحفظنا البيانات في Firestore، وعرضناها كلها في RecyclerView.

> On screen: *Storage و Firestore و RecyclerView*

**[9:45]** الكود الكامل موجود في مجلد android-app. افتحه في Android Studio، وأضف ملف google-services.json الخاص بك، وجرّبه بنفسك. إلى اللقاء!

> On screen: *خذ الكود الكامل وجرّبه بنفسك!*
