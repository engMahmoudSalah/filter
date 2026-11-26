(function () {
  var root = document.getElementById("advisor");
  if (!root) return;
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; }
  var LEVELS = [
    { max: 150, tag: "مياه عذبة", pick: "فلتر 7 مراحل رايت ووتر الاقتصادي", why: "الأملاح منخفضة، فالمطلوب تنقية الشوائب والكلور والطعم. الفلتر المتعدد المراحل كافي." },
    { max: 400, tag: "ملوحة متوسطة", pick: "رايت ووتر بوكس RO بالتناضح العكسي", why: "الأملاح متوسطة، والتناضح العكسي يقلل الأملاح الذائبة ويعطي مياه أنقى." },
    { max: 1000, tag: "ملوحة عالية", pick: "رايت ووتر بوكس RO مع مرحلة تنقية أولية", why: "الأملاح عالية، ننصح بنظام RO مع فلتر الرواسب قبل الغشاء لحمايته وإطالة عمره." },
    { max: 1e9, tag: "ملوحة عالية جدا", pick: "نظام RO بسعة أكبر بعد معاينة المياه", why: "القراءة مرتفعة جدا. تواصل معنا لمعاينة المياه واختيار النظام المناسب." }
  ];
  root.appendChild(el("h2", "adv-h", "أي فلتر يناسب مياهك؟"));
  root.appendChild(el("p", "adv-p", "اكتب قراءة الأملاح الذائبة TDS لمياه البيت (بجهاز القياس، بوحدة ppm) وهنرشحلك الأنسب. الترشيح استرشادي."));
  var lab = el("label", "adv-l", "قراءة TDS (ppm)");
  var inp = el("input"); inp.type = "number"; inp.min = "0"; inp.max = "5000"; inp.inputMode = "numeric"; inp.placeholder = "مثال: 320";
  lab.appendChild(inp);
  var chips = el("div", "adv-chips");
  [["عذبة", 100], ["متوسطة", 300], ["مالحة", 700]].forEach(function (c) {
    var b = el("button", "adv-chip", c[0]); b.type = "button";
    b.addEventListener("click", function () { inp.value = c[1]; show(); });
    chips.appendChild(b);
  });
  var out = el("div", "adv-out"); out.setAttribute("aria-live", "polite");
  root.appendChild(lab); root.appendChild(chips); root.appendChild(out);
  function show() {
    out.textContent = "";
    var v = parseFloat(inp.value);
    if (isNaN(v) || v < 0) return;
    var L = LEVELS.filter(function (l) { return v <= l.max; })[0];
    var box = el("div", "adv-card");
    box.appendChild(el("span", "adv-tag", L.tag + " (" + Math.round(v) + " ppm)"));
    box.appendChild(el("strong", "adv-pick", L.pick));
    box.appendChild(el("p", "adv-why", L.why));
    var a = el("a", "adv-cta", "شاهد منتجاتنا"); a.href = "#top-products";
    box.appendChild(a);
    out.appendChild(box);
  }
  inp.addEventListener("input", show);
})();
