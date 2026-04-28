function startPath(p) {
  currentPath = p;
  idx = 0;
  convState = {first: false, second: false};
  reframeState = {m1revealed: false, m1answered: false, m2revealed: false, m2answered: false};
  var n1 = p === "teacher" ? TF.slice() : SF.slice();
  var n2 = p === "teacher" ? SF.slice() : TF.slice();
  flow = n1.concat(["transition"], n2, ["convergence","research","reframes","strategies","final"]);
  render(); window.scrollTo(0,0);
}

function advance() {
  if (idx < flow.length - 1) {
    idx++;
    var app = document.getElementById("app");
    var screen = app.querySelector('.screen');
    if (screen) {
      screen.classList.add('leaving');
      setTimeout(function() { render(); window.scrollTo(0,0); }, 150);
    } else {
      render(); window.scrollTo(0,0);
    }
  }
}

function toggleFC(id) {
  var body = document.getElementById("fc-body-" + id);
  var hint = document.getElementById("fc-hint-" + id);
  if (body.classList.contains("show")) {
    body.classList.remove("show");
    hint.textContent = "Click to learn more";
  } else {
    body.classList.add("show");
    hint.textContent = "Click to collapse";
  }
}

function toggleGterm(id) {
  document.getElementById("gdef-" + id).classList.toggle("show");
}

function toggleStrat(id) {
  document.getElementById("sc-" + id).classList.toggle("open");
}

function showMore() {
  document.getElementById("more-grid").classList.add("show");
  document.getElementById("btn-more").style.display = "none";
}

function revealMoment(n) {
  document.getElementById("moment-after-" + n).classList.add("show");
  document.getElementById("reveal-btn-" + n).style.display = "none";
  document.getElementById("quiz-block-" + n).classList.add("show");
  if (n === 1) reframeState.m1revealed = true;
  else reframeState.m2revealed = true;
}

function answerReframeQuiz(moment, chosen, correct) {
  if (moment === 1 && reframeState.m1answered) return;
  if (moment === 2 && reframeState.m2answered) return;

  var opts = document.querySelectorAll(".quiz-opt-m" + moment);

  if (chosen === correct) {
    // correct - lock everything
    if (moment === 1) reframeState.m1answered = true;
    else reframeState.m2answered = true;
    opts.forEach(function(o, i) {
      if (i === correct) o.className = "quiz-opt quiz-opt-m" + moment + " correct";
      else o.className = "quiz-opt quiz-opt-m" + moment + " neutral";
      o.onclick = null;
    });
  } else {
    // wrong - only mark this one incorrect, leave others clickable
    opts.forEach(function(o, i) {
      if (i === chosen) o.className = "quiz-opt quiz-opt-m" + moment + " incorrect";
    });
  }

  var feedbacks = [
    [ // moment 1 feedbacks
      "Think-pair-share helps because it gives Mei time to formulate her thoughts before speaking. It is not about lowering expectations. It is about changing the format so she can express her knowledge without feeling overwhelmed.",
      "Exactly. Think-pair-share removes the pressure of immediate public response. It gives Mei the processing time she needs to move from internal understanding to spoken English, without the anxiety of the whole class watching.",
      "Translanguaging is also valuable, but in this specific moment the issue is processing time, not language choice. Think-pair-share addresses that directly by building in a step before whole-class sharing.",
      "Cold calling is the very thing that put Mei on the spot and repeating it more often would increase anxiety, not build confidence."
    ],
    [ // moment 2 feedbacks
      "Asking Mei to speak more still prioritizes verbal participation. The research suggests the format of participation matters more than increasing the frequency of the same format.",
      "Simplifying content is not the issue here. Mei completed the assignment correctly. The barrier is not comprehension but the mode of expected participation.",
      "Exactly. Asking for a written question acknowledges that participation can take many forms. It meets Mei where she is and signals that her way of engaging has value in this classroom.",
      "Staying after class addresses a symptom rather than the structure. The goal is to change how participation works for everyone, not to give Mei extra time to perform the same task privately."
    ]
  ];

  var fb = document.getElementById("quiz-fb-" + moment);
  fb.innerHTML = feedbacks[moment - 1][chosen];
  fb.className = "quiz-feedback show " + (chosen === correct ? "fb-correct" : "fb-incorrect");

  var nextBtn = document.getElementById("reframe-next-" + moment);
  if (nextBtn) nextBtn.style.display = "inline-block";

  // show overall next button if both done
  if (reframeState.m1answered && reframeState.m2answered) {
    document.getElementById("reframe-advance").style.display = "inline-block";
  }
}

function clickConvCard(which) {
  var isT = currentPath === "teacher";
  var firstKey = isT ? "t" : "s";
  var secondKey = isT ? "s" : "t";

  if (which === firstKey && !convState.first) {
    convState.first = true;
    document.getElementById("conv-card-" + firstKey).querySelector(".conv-reveal").classList.add("show");
    document.getElementById("conv-card-" + firstKey).querySelector(".card-icon").textContent = "-";
    document.getElementById("conv-card-" + secondKey).classList.remove("locked");
  } else if (which === secondKey && convState.first && !convState.second) {
    convState.second = true;
    document.getElementById("conv-card-" + secondKey).querySelector(".conv-reveal").classList.add("show");
    document.getElementById("conv-card-" + secondKey).querySelector(".card-icon").textContent = "-";
    document.getElementById("conv-conclusion").classList.add("show");
    document.getElementById("conv-next-btn").style.display = "inline-block";
  }
}

function render() {
  var s = flow[idx];
  var app = document.getElementById("app");
  var totalN = TF.length;
  var firstEnd = totalN;
  var secondEnd = firstEnd + 1 + SF.length;
  var stepLabel = "";
  if (idx < firstEnd) stepLabel = (idx+1) + " / " + totalN;
  else if (idx > firstEnd && idx < secondEnd) stepLabel = (idx - firstEnd) + " / " + totalN;
  var isT = currentPath === "teacher";

  if (typeof s === "object") {
    var lbl = s.path === "t" ? "Ms. Greene&#39;s perspective" : "Mei&#39;s perspective";
    var linesHtml = s.lines.map(function(l){ return '<span class="story-line">' + l + '</span>'; }).join('');
    var contentHtml = s.q
      ? '<p class="story-text">' + linesHtml + '</p><p class="quote-text ' + s.qt + '">' + s.quote + '</p>'
      : '<p class="story-text">' + linesHtml + '</p>';
    app.innerHTML = '<div class="screen active narrative">'
      + '<div class="scene-img-wrap"><img src="' + IMGS[s.img] + '" alt=""/><div class="scene-overlay"></div></div>'
      + '<div class="scene-body"><div><p class="path-label ' + s.path + '">' + lbl + '</p>' + contentHtml + '</div>'
      + '<div class="nav-bottom"><span class="step-ind">' + stepLabel + '</span>'
      + '<button class="btn btn-ghost" onclick="advance()">Next &#8594;</button>'
      + '</div></div></div>';

  } else if (s === "transition") {
    var tLine1 = isT
      ? 'You just saw the classroom through Ms. Greene&#39;s eyes.'
      : 'You just saw the class through Mei&#39;s eyes.';
    var tLine2 = isT
      ? 'Now let&#39;s see Mei&#39;s perspective.'
      : 'Now let&#39;s look at what Ms. Greene sees.';
    app.innerHTML = '<div class="screen active transition-screen">'
      + '<img src="' + IMGS["classroom_wide"] + '" alt=""/>'
      + '<div class="transition-body">'
      + '<p>' + tLine1 + '</p>'
      + '<p>' + tLine2 + '</p>'
      + '<button class="btn btn-ghost" onclick="advance()">Continue &#8594;</button>'
      + '</div></div>';

  } else if (s === "convergence") {
    var fk = isT ? "t" : "s";
    var sk = isT ? "s" : "t";
    var fClass = isT ? "t-card" : "s-card";
    var sClass = isT ? "s-card" : "t-card";
    var fPrompt = isT ? "Ms. Greene&#39;s view" : "Mei&#39;s experience";
    var sPrompt = isT ? "Mei&#39;s experience" : "Ms. Greene&#39;s view";
    var fLabel = isT ? "See what Ms. Greene saw" : "See what was actually happening";
    var sLabel = isT ? "See what was actually happening" : "See what Ms. Greene saw";
    var tRows = '<div class="cr-item"><span class="cr-before">Quiet</span><span class="cr-arr">&#8594;</span><span class="cr-after">Disengaged</span></div>'
      + '<div class="cr-item"><span class="cr-before">No questions</span><span class="cr-arr">&#8594;</span><span class="cr-after">Passive</span></div>'
      + '<div class="cr-item"><span class="cr-before">Notes, no speech</span><span class="cr-arr">&#8594;</span><span class="cr-after">Not thinking critically</span></div>';
    var sRows = '<div class="cr-item"><span class="cr-before">Quiet</span><span class="cr-arr">&#8594;</span><span class="cr-after">Respectful, processing</span></div>'
      + '<div class="cr-item"><span class="cr-before">No questions</span><span class="cr-arr">&#8594;</span><span class="cr-after">Trusting and respecting the teacher</span></div>'
      + '<div class="cr-item"><span class="cr-before">Notes, no speech</span><span class="cr-arr">&#8594;</span><span class="cr-after">Deeply engaged</span></div>';
    var fRows = isT ? tRows : sRows;
    var secRows = isT ? sRows : tRows;

    app.innerHTML = '<div class="screen active conv-screen">'
      + '<img src="' + IMGS["group_table"] + '" alt=""/>'
      + '<div class="conv-body">'
      + '<p class="conv-eyebrow">Side by side</p>'
      + '<p class="conv-heading">Two readings of the same moment</p>'
      + '<div class="conv-stack">'
      + '<button id="conv-card-' + fk + '" class="conv-card-btn ' + fClass + '" onclick="clickConvCard(\'' + fk + '\')">'
      + '<div class="card-header"><div><p class="card-prompt">' + fPrompt + '</p><p class="card-label">' + fLabel + '</p></div><span class="card-icon">+</span></div>'
      + '<div class="conv-reveal"><div class="conv-reveal-row">' + fRows + '</div></div>'
      + '</button>'
      + '<button id="conv-card-' + sk + '" class="conv-card-btn ' + sClass + ' locked" onclick="clickConvCard(\'' + sk + '\')">'
      + '<div class="card-header"><div><p class="card-prompt">' + sPrompt + '</p><p class="card-label">' + sLabel + '</p></div><span class="card-icon">+</span></div>'
      + '<div class="conv-reveal"><div class="conv-reveal-row">' + secRows + '</div></div>'
      + '</button>'
      + '</div>'
      + '<div id="conv-conclusion" class="conv-conclusion">'
      + '<p>The same scenario can have an unexpected meaning.</p>'
      + '<p>Here&#39;s what you can do to help you recognize and respond to this in the classroom.</p>'
      + '</div>'
      + '<div style="text-align:right;margin-top:1rem;">'
      + '<button id="conv-next-btn" class="btn btn-ghost" onclick="advance()" style="display:none;">Learn what steps you can take &#8594;</button>'
      + '</div></div></div>';

  } else if (s === "research") {
    app.innerHTML = '<div class="screen active research-screen">'
      + '<p class="section-eyebrow">Understanding the story</p>'
      + '<p class="section-title">What the research tells us</p>'

      + '<div class="finding-card">'
      + '<div class="fc-top" onclick="toggleFC(1)">'
      + '<img class="fc-img" src="' + IMGS["teacher_front"] + '" alt=""/>'
      + '<div class="fc-title-block">'
      + '<p class="fc-eyebrow">Henrich, Heine &amp; Norenzayan (2010)</p>'
      + '<p class="fc-core">Ms. Greene isn&#39;t a bad teacher. She&#39;s drawing on a deeply ingrained idea of what learning looks like based on her own experiences. Speak up. Ask questions. Show your thinking out loud. But that model isn&#39;t universal.</p>'
      + '<p class="fc-citation">Henrich, J., Heine, S. J., &amp; Norenzayan, A. (2010). The weirdest people in the world? <em>Behavioral and Brain Sciences, 33</em>(2&#8211;3), 61&#8211;83.</p>'
      + '<p class="fc-expand-hint" id="fc-hint-1">Click to learn more</p>'
      + '</div></div>'
      + '<div class="fc-body" id="fc-body-1"><div class="fc-lines"><ul>'
      + '<li>Researchers Henrich, Heine, and Norenzayan found that most of what we assume to be normal human behavior is actually drawn from <span class="gterm" onclick="event.stopPropagation();toggleGterm(1)">WEIRD</span> populations.</li>'
      + '</ul><div class="gdef" id="gdef-1">Western, Educated, Industrialized, Rich, and Democratic. A term used to describe the narrow population most psychology and education research is based on.</div><ul>'
      + '<li>People from WEIRD societies tend to be outliers compared to the rest of the world.</li>'
      + '<li>The way Ms. Greene defines participation reflects that narrow slice of human experience.</li>'
      + '<li>It feels like common sense because it has been treated as the default.</li>'
      + '<li>But for Mei, it is not the default.</li>'
      + '</ul></div></div></div>'

      + '<div class="finding-card">'
      + '<div class="fc-top" onclick="toggleFC(2)">'
      + '<img class="fc-img" src="' + IMGS["student_writing"] + '" alt=""/>'
      + '<div class="fc-title-block">'
      + '<p class="fc-eyebrow">Markus &amp; Kitayama (2010)</p>'
      + '<p class="fc-core">When Mei stays quiet, she isn&#39;t zoning out. She is listening but taking more time to process. Ms. Greene reads silence as lack of understanding. But for Mei, silence is a form of presence.</p>'
      + '<p class="fc-citation">Markus, H. R., &amp; Kitayama, S. (2010). Cultures and selves: A cycle of mutual constitution. <em>Perspectives on Psychological Science, 5</em>(4), 420&#8211;430.</p>'
      + '<p class="fc-expand-hint" id="fc-hint-2">Click to learn more</p>'
      + '</div></div>'
      + '<div class="fc-body" id="fc-body-2"><div class="fc-lines"><ul>'
      + '<li>Markus and Kitayama found that cultures shape how we understand ourselves in relation to others.</li>'
      + '<li>In <span class="gterm" onclick="event.stopPropagation();toggleGterm(2)">independent</span> cultural contexts, like most Western classrooms, individuals are expected to express themselves, stand out, and assert their own ideas.</li>'
      + '</ul><div class="gdef" id="gdef-2">A self-concept where expressing your own thoughts, standing out, and asserting your ideas are seen as signs of engagement and confidence.</div><ul>'
      + '<li>In <span class="gterm" onclick="event.stopPropagation();toggleGterm(3)">interdependent</span> cultural contexts, the self is defined through relationships, fitting in, listening carefully, and not overstepping.</li>'
      + '</ul><div class="gdef" id="gdef-3">A self-concept where listening carefully, fitting in, and being attuned to others are seen as signs of respect and engagement.</div><ul>'
      + '<li>Mei isn&#39;t disengaged. She is operating from a deeply interdependent sense of self.</li>'
      + '<li>Her silence is not a gap. It is a different way of being present.</li>'
      + '</ul></div></div></div>'

      + '<div class="finding-card">'
      + '<div class="fc-top" onclick="toggleFC(3)">'
      + '<img class="fc-img" src="' + IMGS["notes_desk"] + '" alt=""/>'
      + '<div class="fc-title-block">'
      + '<p class="fc-eyebrow">Li (2012)</p>'
      + '<p class="fc-core">Every night, Mei goes home and reads through her notes again. Ms. Greene doesn&#39;t see that part. Mei is not falling behind. She is following a learning process she has trusted her whole life.</p>'
      + '<p class="fc-citation">Li, J. (2012). Chapter 4: Mind-Oriented and Virtue-Oriented Learning Processes. In <em>Cultural foundations of learning: East and West</em> (1st ed.). Cambridge University Press.</p>'
      + '<p class="fc-expand-hint" id="fc-hint-3">Click to learn more</p>'
      + '</div></div>'
      + '<div class="fc-body" id="fc-body-3"><div class="fc-lines"><ul>'
      + '<li> Li describes two distinct orientations to learning that differ between Western and East Asian contexts.</li>'
      + '<li><span class="gterm" onclick="event.stopPropagation();toggleGterm(4)">Mind-oriented learning</span> focuses on individual performance. Asking questions. Demonstrating understanding in the moment. Getting the right answer out loud.</li>'
      + '</ul><div class="gdef" id="gdef-4">A Western model of learning centered on demonstrating individual understanding, asking questions, and performing knowledge out loud.</div><ul>'
      + '<li><span class="gterm" onclick="event.stopPropagation();toggleGterm(5)">Virtue-oriented learning</span> focuses on diligence, humility, and continuous effort over time. Understanding is something you earn through repeated engagement, not something you display on demand.</li>'
      + '</ul><div class="gdef" id="gdef-5">An East Asian model of learning centered on diligence, humility, and cumulative effort. Understanding deepens over time through reflection and review, not immediate display.</div><ul>'
      + '<li>Confucius ideology, which can often be seen in East Asian cultures, taught that learning is cumulative. Reviewing what you have already encountered is not repetition for its own sake, but how new insight emerges.</li>'
      + '<li>For Mei, going home and working through her notes isn&#39;t a sign that she didn&#39;t understand in class.</li>'
      + '<li>It is her learning process working exactly as it should.</li>'
      + '</ul></div></div></div>'

      + '<div style="text-align:right;margin-top:1.5rem;"><button class="btn btn-ghost" onclick="advance()">What you can do differently &#8594;</button></div>'
      + '</div>';

  } else if (s === "reframes") {
    app.innerHTML = '<div class="screen active reframe-screen">'
      + '<p class="section-eyebrow">Putting it into practice</p>'
      + '<p class="section-title">What Ms. Greene could do differently</p>'

      // MOMENT 1
      + '<div class="moment-block">'
      + '<p class="moment-label">Moment 1: The cold call</p>'
      + '<div class="moment-before"><p class="mb-label">What happened</p><p>&#8220;Mei, I noticed you haven&#39;t spoken in a bit. What do you think about this?&#8221;</p></div>'
      + '<div style="margin-top:0.75rem;"><button id="reveal-btn-1" class="btn-reveal" onclick="revealMoment(1)">See a different approach</button></div>'
      + '<div id="moment-after-1" class="moment-after">'
      + '<p class="ma-label">A different approach</p>'
      + '<p>Give Mei a moment to write her thoughts down first.</p>'
      + '<p>Then ask her to share with a partner before the whole class.</p>'
      + '<p>This is <span class="gterm" onclick="toggleGterm(6)">think-pair-share</span>. It gives students processing time before performing. For Mei, that small shift changes everything. She isn&#39;t unprepared. She just needs a moment to move from her internal process to an English spoken response.</p>'
      + '<div class="gdef" id="gdef-6">An instructional strategy where students think individually, discuss with a partner, then share with the class. It lowers the stakes of public participation and gives multilingual learners processing time.</div>'
      + '</div>'
      + '<div id="quiz-block-1" class="quiz-block">'
      + '<p class="quiz-q-label" style="margin-top:1rem;">Check your understanding</p>'
      + '<p class="quiz-q-text">Why does think-pair-share help a student like Mei specifically?</p>'
      + '<div class="quiz-opts">'
      + '<button class="quiz-opt quiz-opt-m1" onclick="answerReframeQuiz(1,0,1)">It lowers the academic expectations so she feels less pressure.</button>'
      + '<button class="quiz-opt quiz-opt-m1" onclick="answerReframeQuiz(1,1,1)">It gives her processing time before she has to speak publicly in English.</button>'
      + '<button class="quiz-opt quiz-opt-m1" onclick="answerReframeQuiz(1,2,1)">It lets her respond in her home language first.</button>'
      + '<button class="quiz-opt quiz-opt-m1" onclick="answerReframeQuiz(1,3,1)">It means she gets called on more often so she builds confidence faster.</button>'
      + '</div>'
      + '<div id="quiz-fb-1" class="quiz-feedback"></div>'
      + '</div>'
      + '</div>'

      // MOMENT 2
      + '<div class="moment-block">'
      + '<p class="moment-label">Moment 2: The homework comment</p>'
      + '<div class="moment-before"><p class="mb-label">What happened</p><p>&#8220;Try to ask more questions next time.&#8221;</p></div>'
      + '<div style="margin-top:0.75rem;"><button id="reveal-btn-2" class="btn-reveal" onclick="revealMoment(2)">See a different approach</button></div>'
      + '<div id="moment-after-2" class="moment-after">'
      + '<p class="ma-label">A different approach</p>'
      + '<p>Ask Mei to write one question she has about the material. Any question.</p>'
      + '<p>Acknowledge that in this class, written questions count just as much as spoken ones.</p>'
      + '<p>This is <span class="gterm" onclick="toggleGterm(7)">translanguaging</span> in practice. Letting students engage in the way that works for their whole self, not just the English speaking part. It also signals to Mei that her way of participating has value here.</p>'
      + '<div class="gdef" id="gdef-7">A pedagogical approach that allows multilingual learners to draw on their full linguistic repertoire to make meaning and demonstrate understanding.</div>'
      + '</div>'
      + '<div id="quiz-block-2" class="quiz-block">'
      + '<p class="quiz-q-label" style="margin-top:1rem;">Check your understanding</p>'
      + '<p class="quiz-q-text">What is the most effective adjustment Ms. Greene could make after noticing Mei doesn&#39;t ask questions out loud?</p>'
      + '<div class="quiz-opts">'
      + '<button class="quiz-opt quiz-opt-m2" onclick="answerReframeQuiz(2,0,2)">Encourage her to speak up more often during class.</button>'
      + '<button class="quiz-opt quiz-opt-m2" onclick="answerReframeQuiz(2,1,2)">Simplify the lesson content so Mei has an easier entry point.</button>'
      + '<button class="quiz-opt quiz-opt-m2" onclick="answerReframeQuiz(2,2,2)">Ask students to write one question at the end of class, accepting written responses as valid participation.</button>'
      + '<button class="quiz-opt quiz-opt-m2" onclick="answerReframeQuiz(2,3,2)">Invite Mei to stay after class to go over questions privately.</button>'
      + '</div>'
      + '<div id="quiz-fb-2" class="quiz-feedback"></div>'
      + '</div>'
      + '</div>'

      + '<div style="text-align:right;margin-top:1.5rem;">'
      + '<button id="reframe-advance" class="btn btn-ghost" onclick="advance()" style="display:none;">General strategies &#8594;</button>'
      + '</div></div>';

  } else if (s === "strategies") {
    app.innerHTML = '<div class="screen active strategy-screen">'
      + '<p class="section-eyebrow">Take this with you</p>'
      + '<p class="section-title">Classroom strategies</p>'
      + '<div class="strategy-grid">'
      + makeStratCard(1,"Give writing time first","Before asking a student to speak out loud, give them a moment to write their thoughts down. For students like Mei, this bridges the gap between internal understanding and verbal response.")
      + makeStratCard(2,"Lower the stakes with think-pair-share","Instead of cold calling, ask students to share with a partner first. This gives multilingual learners processing time and makes participation feel safer.")
      + makeStratCard(3,"Learning happens beyond your classroom","A student who seems disengaged in class may be doing their deepest learning at home. Trust that the process continues even when you can&#39;t see it.")
      + '</div>'
      + '<button id="btn-more" class="btn-more" onclick="showMore()">View more strategies</button>'
      + '<div id="more-grid" class="more-grid">'
      + makeStratCard(4,"Writing is participation","Written questions and responses are just as valid as spoken ones. Making this explicit in your classroom changes what participation looks like for everyone.")
      + makeStratCard(5,"Pause before making assumptions","Before reading a behavior as disengagement, ask yourself what learning norms this student might be bringing from home. Silence and careful note-taking can be signs of deep cultural investment in learning.")
      + makeStratCard(6,"Make content feel familiar","Find entry points into your lesson that connect to students&#39; cultural experiences. When content feels relevant to who they are, engagement follows naturally.")
      + '</div>'
      + '<div style="text-align:right;margin-top:1.5rem;"><button class="btn btn-ghost" onclick="advance()">Final reflection &#8594;</button></div>'
      + '</div>';

  } else if (s === "final") {
    app.innerHTML = '<div class="screen active final-screen">'
      + '<div class="final-content">'
      + '<p class="final-prompt">What will you do differently in your classroom after this module?</p>'
      + '<textarea class="final-textarea" placeholder="Write your response here..."></textarea>'
      + '<button class="btn-finish" onclick="goHome()">Finish</button>'
      + '</div></div>';
  }
}

function makeStratCard(id, label, body) {
  return '<div class="strat-card" id="sc-' + id + '" onclick="toggleStrat(' + id + ')">'
    + '<div class="sc-top"><p class="sc-label">' + label + '</p><span class="sc-icon">+</span></div>'
    + '<p class="sc-hint">Click to expand</p>'
    + '<div class="sc-body">' + body + '</div>'
    + '</div>';
}

function goHome() {
  var app = document.getElementById("app");
  app.innerHTML = '<div class="screen active landing">'
    + '<img src="' + IMGS["landing"] + '" alt="classroom"/>'
    + '<div class="landing-body">'
    + '<p>The class is discussing a question.</p>'
    + '<p>Some students raise their hands quickly. Other students call out without being called on.</p>'
    + '<p>One student listens carefully, watching, writing everything down.</p>'
    + '<p class="q">What does classroom participation look like?</p>'
    + '<div class="btn-row">'
    + '<button class="btn btn-t" onclick="startPath(\'teacher\')">Follow Ms. Greene</button>'
    + '<button class="btn btn-s" onclick="startPath(\'student\')">Follow Mei</button>'
    + '</div></div></div>';
}

goHome();
