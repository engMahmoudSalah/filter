(function () {
  var root = document.getElementById("reminder");
  if (!root) return;
  var STAGES = [
    { n: "مرحلة الشمع / الرواسب (PP)", m: 3 },
    { n: "مرحلة الكربون (GAC / CTO)", m: 6 },
    { n: "مرحلة الكربون الثانية", m: 6 },
    { n: "غشاء التناضح العكسي (RO)", m: 24 },
    { n: "مرحلة المعادن / ما بعد المعالجة", m: 12 }
  ];
  var KEY = "rw_filter_date_v1";
  var ar = new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addMonths(d, m) { var x = new Date(d.getFullYear(), d.getMonth() + m, d.getDate()); return x; }
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; }

  var h = el("h2", "rem-h", "موعد تغيير الفلتر");
  var p = el("p", "rem-p", "اختر تاريخ آخر تغيير لشمعات الفلتر لتعرف المواعيد التقريبية للتغيير القادم. المدد إرشادية عامة وتختلف حسب جودة المياه ونوع الفلتر، راجع فني رايت ووتر للتأكيد.");
  var lab = el("label", "rem-l", "تاريخ آخر تغيير");
  var inp = el("input"); inp.type = "date"; inp.max = iso(new Date());
  lab.appendChild(inp);
  var out = el("div", "rem-out"); out.setAttribute("aria-live", "polite");
  var ics = el("button", "rem-btn", "حفظ التذكير في التقويم (ICS)"); ics.type = "button"; ics.hidden = true;
  root.appendChild(h); root.appendChild(p); root.appendChild(lab); root.appendChild(out); root.appendChild(ics);

  var rows = [];
  function render() {
    out.textContent = "";
    rows = [];
    if (!inp.value) return;
    var base = new Date(inp.value + "T00:00:00");
    if (isNaN(base)) return;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var ul = el("ul", "rem-list");
    STAGES.forEach(function (s) {
      var due = addMonths(base, s.m);
      var days = Math.round((due - now) / 86400000);
      var li = el("li", days < 0 ? "late" : days <= 30 ? "soon" : "ok");
      li.appendChild(el("strong", null, s.n));
      var st = days < 0 ? "متأخر منذ " + Math.abs(days) + " يوم" : days === 0 ? "اليوم" : "بعد " + days + " يوم";
      li.appendChild(el("span", null, ar.format(due) + " (" + st + ")"));
      ul.appendChild(li);
      rows.push({ n: s.n, due: due });
    });
    out.appendChild(ul);
    ics.hidden = false;
    try { localStorage.setItem(KEY, inp.value); } catch (e) {}
  }
  ics.addEventListener("click", function () {
    var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Right Water//Filter reminder//AR", "CALSCALE:GREGORIAN"];
    rows.forEach(function (r, i) {
      var d = r.due, e = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      var f = function (x) { return x.getFullYear() + pad(x.getMonth() + 1) + pad(x.getDate()); };
      L.push("BEGIN:VEVENT", "UID:rw-" + f(d) + "-" + i + "@right-water", "DTSTAMP:" + f(new Date()) + "T000000Z",
        "DTSTART;VALUE=DATE:" + f(d), "DTEND;VALUE=DATE:" + f(e), "SUMMARY:تغيير الفلتر: " + r.n, "END:VEVENT");
    });
    L.push("END:VCALENDAR");
    var url = URL.createObjectURL(new Blob([L.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
    var a = document.createElement("a"); a.href = url; a.download = "right-water-filter-reminder.ics";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
  inp.addEventListener("change", render);
  try { var v = localStorage.getItem(KEY); if (v) { inp.value = v; render(); } } catch (e) {}
})();
