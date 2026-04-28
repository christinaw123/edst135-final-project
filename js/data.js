var TF = [
  {path:"t",img:"classroom_wide",lines:["It has been two months since Mei, a student that immigrated from China, joined your class.","You have been keeping an eye on her since day one.","Making sure she has the materials and checking in after class.","You try your best to make her feel welcome."],q:false},
  {path:"t",img:"teacher_front",lines:["Today you are introducing photosynthesis to your 6th graders","You ask the class what they already know.","Hands shoot up. Jordan calls out without even waiting.","A few kids are already debating."],q:false},
  {path:"t",img:"classroom_wide",lines:["Mei is quiet.","She has been quiet like this since she arrived.","You tell yourself it is an adjustment period.","But three months in, you are starting to worry."],q:false},
  {path:"t",img:"teacher_front",lines:["You watch her write something in her notebook.","At least she is taking notes.","But she has not said a single word."],q:false},
  {path:"t",img:"teacher_front",lines:["You decide to gently bring her in."],q:true,qt:"tq",quote:"Mei, I noticed you haven&#39;t spoken in a bit. What do you think about this?"},
  {path:"t",img:"classroom_wide",lines:["She looks up. A long pause.","&#8220;I&#39;m not sure,&#8221; she says softly.","You smile and move on, not wanting to put her on the spot further."],q:false},
  {path:"t",img:"teacher_front",lines:["But the worry stays with you for the rest of the period.","Is she understanding any of this?","Is the language barrier bigger than you realized?"],q:false},
  {path:"t",img:"classroom_wide",lines:["She is so diligent with her notes and has been doing decent on quizzes.","But is she actually grasping the concepts?","Or just copying words she does not understand?"],q:false},
  {path:"t",img:"teacher_front",lines:["You make a mental note to follow up with her parents.","Maybe she needs more support than you can give in class alone."],q:false},
  {path:"t",img:"classroom_wide",lines:["You care about Mei. You want her to succeed.","You just wish she would talk and ask for help more."],q:false}
];

var SF = [
  {path:"s",img:"student_writing",lines:["You have been in this school for three months now.","Ms. Greene&#39;s class is one of the ones you look forward to.","She is kind and you don't want to let her down."],q:false},
  {path:"s",img:"classroom_wide",lines:["Today's lesson is on photosynthesis.","You recognize the word from the textbook.","You open your notebook and start writing before she even finishes the first sentence."],q:false},
  {path:"s",img:"student_writing",lines:["Around you, other kids are shouting out answers.","You do not understand how they can speak so fast without thinking first.","At home, speaking without thinking is considered rude."],q:false},
  {path:"s",img:"notes_desk",lines:["You want to contribute.","But what if your English comes out wrong?","What if you say the right thing but in the wrong way","and everyone looks at you?"],q:false},
  {path:"s",img:"student_writing",lines:["So you keep writing.","You will understand it better tonight","when you go through your notes slowly in your own time at home."],q:false},
  {path:"s",img:"classroom_wide",lines:["&#8220;Mei, I noticed you haven&#39;t spoken in a bit."],q:true,qt:"sq",quote:"What do you think about this?"},
  {path:"s",img:"student_writing",lines:["Everyone turns to look at you. Your face feels hot.","You know what photosynthesis is. You read about it last night.","But the words in English will not come."],q:false},
  {path:"s",img:"notes_desk",lines:["&#8220;I&#39;m not sure,&#8221; you say.","It is not true. You are sure.","You just could not find the words fast enough."],q:false},
  {path:"s",img:"student_writing",lines:["Ms. Greene smiles and moves on. The class moves on.","You look back down at your notebook."],q:false},
  {path:"s",img:"notes_desk",lines:["You circle the word.","You will figure it out tonight.","You just hope she does not think you are not paying attention in class."],q:false}
];

var flow = [], currentPath = null, idx = 0;
var convState = {first: false, second: false};
var reframeState = {m1revealed: false, m1answered: false, m2revealed: false, m2answered: false};

