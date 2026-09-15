/* Retain Invoice Generator - vanilla JS, autosave localStorage, print A4 */
(function () {
  "use strict";

  var LS_KEY = "retain:invoice:v1";

  function $(id) { return document.getElementById(id); }

  function uid() {
    return "it-" + Math.random().toString(36).slice(2, 9);
  }

  function toNum(v) {
    var n = parseFloat(v);
    if (isNaN(n) || n < 0) { return 0; }
    return n;
  }

  function fmtRp(n) {
    var v = toNum(n);
    try {
      return "Rp " + Math.round(v).toLocaleString("id-ID");
    } catch (e) {
      return "Rp " + Math.round(v);
    }
  }

  function fmtDate(iso) {
    if (!iso) { return "-"; }
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) { return "-"; }
    try {
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function blankItem() {
    return { id: uid(), title: "", sub: "", amount: 0 };
  }

  function defaultState() {
    return {
      senderName: "Retain Solusi Bisnis",
      senderEmail: "ivan@retain.co.id",
      signerName: "Ivan Prabumi",
      signerPhone: "081222156655",
      logo: "",
      clientName: "PT Wingman Denim Global",
      clientPic: "",
      clientPhone: "",
      showAmounts: false,
      tableHead: "Deskripsi",
      invDate: "2026-08-20",
      invDue: "2026-08-21",
      items: [
        { id: uid(), title: "IT Consulting & Advisory Fee", sub: "Periode: Agustus 2026", amount: 1538462 },
        { id: uid(), title: "Monthly IT Maintenance & Support", sub: "Periode: Agustus 2026", amount: 1538461 }
      ],
      bankName: "BCA",
      bankNumber: "7772861063",
      bankOwner: "Ivan Prabumi",
      signature: ""
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) { return defaultState(); }
      var s = JSON.parse(raw);
      var d = defaultState();
      for (var k in d) {
        if (s[k] === undefined || s[k] === null) { s[k] = d[k]; }
      }
      if (!s.items || !s.items.length) { s.items = d.items; }
      return s;
    } catch (e) {
      return defaultState();
    }
  }

  var state = load();
  var saveTimer = null;

  function persist(indicate) {
    if (saveTimer) { clearTimeout(saveTimer); }
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
      if (indicate !== false) {
        var t = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        $("saveText").textContent = "Tersimpan " + t;
      }
    }, 300);
  }

  function calcTotal() {
    var sum = 0;
    for (var i = 0; i < state.items.length; i++) {
      sum += toNum(state.items[i].amount);
    }
    return sum;
  }

  function findItem(id) {
    for (var i = 0; i < state.items.length; i++) {
      if (state.items[i].id === id) { return state.items[i]; }
    }
    return null;
  }

  /* ---------- editor ---------- */

  function fillEditor() {
    $("senderName").value = state.senderName || "";
    $("senderEmail").value = state.senderEmail || "";
    $("signerName").value = state.signerName || "";
    $("signerPhone").value = state.signerPhone || "";
    $("clientName").value = state.clientName || "";
    $("clientPic").value = state.clientPic || "";
    $("clientPhone").value = state.clientPhone || "";
    $("showAmounts").checked = state.showAmounts === true;
    $("tableHead").value = state.tableHead || "";
    $("invDate").value = state.invDate || "";
    $("invDue").value = state.invDue || "";
    $("bankName").value = state.bankName || "";
    $("bankNumber").value = state.bankNumber || "";
    $("bankOwner").value = state.bankOwner || "";
    refreshLogo();
    refreshSign();
  }

  function refreshLogo() {
    var img = $("logoPreview");
    var ph = $("logoPlaceholder");
    var rm = $("logoRemove");
    if (state.logo) {
      img.src = state.logo;
      img.classList.remove("hidden");
      ph.classList.add("hidden");
      rm.classList.remove("hidden");
    } else {
      img.removeAttribute("src");
      img.classList.add("hidden");
      ph.classList.remove("hidden");
      rm.classList.add("hidden");
    }
  }

  function refreshSign() {
    var img = $("signPreview");
    var rm = $("signRemove");
    if (state.signature) {
      img.src = state.signature;
      img.classList.remove("hidden");
      rm.classList.remove("hidden");
    } else {
      img.removeAttribute("src");
      img.classList.add("hidden");
      rm.classList.add("hidden");
    }
  }

  function renderItemsEditor() {
    var box = $("itemsList");
    box.innerHTML = "";
    for (var idx = 0; idx < state.items.length; idx++) {
      (function (it, n) {
        var row = document.createElement("div");
        row.className = "item-row";
        var html = "";
        html += '<div class="item-top">';
        html += '<label class="mini-lbl">Baris ' + (n + 1) + ' — judul';
        html += '<input class="field" type="text" data-k="title" data-id="' + esc(it.id) + '" placeholder="Judul item" value="' + esc(it.title) + '" />';
        html += "</label>";
        html += '<button class="icon-btn" type="button" data-del="' + esc(it.id) + '" title="Hapus baris">x</button>';
        html += "</div>";
        html += '<label class="mini-lbl">Subline';
        html += '<input class="field" type="text" data-k="sub" data-id="' + esc(it.id) + '" placeholder="Periode: Agustus 2026" value="' + esc(it.sub) + '" />';
        html += "</label>";
        html += '<label class="mini-lbl">Nominal (Rp)';
        html += '<input class="field" type="number" min="0" step="any" data-k="amount" data-id="' + esc(it.id) + '" placeholder="0" value="' + esc(it.amount) + '" />';
        html += "</label>";
        row.innerHTML = html;
        box.appendChild(row);
      })(state.items[idx], idx);
    }
  }

  /* ---------- preview ---------- */

  function renderPreview() {
    $("pvSenderName").textContent = state.senderName || "Retain Solusi Bisnis";
    $("pvSenderEmail").textContent = state.senderEmail || "-";
    var contact = state.signerName || "";
    if (state.signerPhone) {
      if (contact) { contact += " - " + state.signerPhone; }
      else { contact = state.signerPhone; }
    }
    $("pvSenderContact").textContent = contact || "-";

    var logoImg = $("pvLogo");
    var logoText = $("pvLogoText");
    if (state.logo) {
      logoImg.src = state.logo;
      logoImg.classList.remove("hidden");
      logoText.classList.add("hidden");
    } else {
      logoImg.removeAttribute("src");
      logoImg.classList.add("hidden");
      logoText.classList.remove("hidden");
    }

    $("pvDate").textContent = fmtDate(state.invDate);
    $("pvDue").textContent = fmtDate(state.invDue);
    $("pvSignDate").textContent = fmtDate(state.invDate);
    $("pvClient").textContent = state.clientName || "PT Wingman Denim Global";
    var cPic = $("pvClientPic");
    if (state.clientPic) {
      cPic.textContent = state.clientPic;
      cPic.classList.remove("hidden");
    } else {
      cPic.textContent = "";
      cPic.classList.add("hidden");
    }
    var cPhone = $("pvClientPhone");
    if (state.clientPhone) {
      cPhone.textContent = state.clientPhone;
      cPhone.classList.remove("hidden");
    } else {
      cPhone.textContent = "";
      cPhone.classList.add("hidden");
    }
    $("pvHead").textContent = state.tableHead || "Deskripsi";

    var list = $("pvItems");
    list.innerHTML = "";
    var shown = 0;
    for (var i = 0; i < state.items.length; i++) {
      (function (it) {
        var has = it.title || it.sub || toNum(it.amount) > 0;
        if (!has) { return; }
        shown++;
        var div = document.createElement("div");
        div.className = "tbl-item";
        var row = document.createElement("div");
        row.className = "tbl-title-row";
        var t = document.createElement("p");
        t.className = "tbl-title";
        t.textContent = "• " + (it.title || "-");
        row.appendChild(t);
        if (state.showAmounts) {
          var amt = document.createElement("span");
          amt.className = "tbl-amount";
          amt.textContent = fmtRp(it.amount);
          row.appendChild(amt);
        }
        var s = document.createElement("p");
        s.className = "tbl-sub";
        s.textContent = it.sub || "";
        div.appendChild(row);
        if (it.sub) { div.appendChild(s); }
        list.appendChild(div);
      })(state.items[i]);
    }
    if (shown === 0) {
      var empty = document.createElement("div");
      empty.className = "tbl-item";
      var erow = document.createElement("div");
      erow.className = "tbl-title-row";
      var p1 = document.createElement("p");
      p1.className = "tbl-title";
      p1.textContent = "• -";
      erow.appendChild(p1);
      if (state.showAmounts) {
        var eamt = document.createElement("span");
        eamt.className = "tbl-amount";
        eamt.textContent = fmtRp(0);
        erow.appendChild(eamt);
      }
      empty.appendChild(erow);
      list.appendChild(empty);
    }

    var total = calcTotal();
    $("pvTotal").textContent = fmtRp(total);
    $("editorTotal").textContent = fmtRp(total);

    $("pvBankName").textContent = state.bankName || "-";
    $("pvBankNumber").textContent = state.bankNumber || "-";
    $("pvBankOwner").textContent = state.bankOwner || "-";
    $("pvSignName").textContent = state.signerName || "-";

    var sImg = $("pvSignImg");
    var sEmpty = $("pvSignEmpty");
    if (state.signature) {
      sImg.src = state.signature;
      sImg.classList.remove("hidden");
      sEmpty.classList.add("hidden");
    } else {
      sImg.removeAttribute("src");
      sImg.classList.add("hidden");
      sEmpty.classList.remove("hidden");
    }
  }

  function renderAll() {
    renderItemsEditor();
    renderPreview();
  }

  /* ---------- bindings ---------- */

  function bindText(id, key) {
    $(id).addEventListener("input", function (e) {
      state[key] = e.target.value;
      persist();
      renderPreview();
    });
  }

  bindText("senderName", "senderName");
  bindText("senderEmail", "senderEmail");
  bindText("signerName", "signerName");
  bindText("signerPhone", "signerPhone");
  bindText("clientName", "clientName");
  bindText("clientPic", "clientPic");
  bindText("clientPhone", "clientPhone");
  bindText("tableHead", "tableHead");
  bindText("bankName", "bankName");
  bindText("bankNumber", "bankNumber");
  bindText("bankOwner", "bankOwner");

  $("showAmounts").addEventListener("change", function (e) {
    state.showAmounts = e.target.checked;
    persist();
    renderPreview();
  });

  $("invDate").addEventListener("change", function (e) {
    state.invDate = e.target.value;
    persist();
    renderPreview();
  });
  $("invDue").addEventListener("change", function (e) {
    state.invDue = e.target.value;
    persist();
    renderPreview();
  });

  $("btnAddItem").addEventListener("click", function () {
    state.items.push(blankItem());
    persist();
    renderItemsEditor();
    renderPreview();
  });

  $("itemsList").addEventListener("input", function (e) {
    var el = e.target;
    var id = el.getAttribute("data-id");
    var k = el.getAttribute("data-k");
    if (!id || !k) { return; }
    var it = findItem(id);
    if (!it) { return; }
    if (k === "amount") { it.amount = el.value; }
    else if (k === "title") { it.title = el.value; }
    else if (k === "sub") { it.sub = el.value; }
    persist();
    renderPreview();
  });

  $("itemsList").addEventListener("click", function (e) {
    var btn = null;
    if (e.target.getAttribute) {
      if (e.target.getAttribute("data-del")) { btn = e.target; }
      else if (e.target.parentNode && e.target.parentNode.getAttribute && e.target.parentNode.getAttribute("data-del")) { btn = e.target.parentNode; }
    }
    if (!btn) { return; }
    var id = btn.getAttribute("data-del");
    if (state.items.length <= 1) {
      state.items = [blankItem()];
    } else {
      var next = [];
      for (var i = 0; i < state.items.length; i++) {
        if (state.items[i].id !== id) { next.push(state.items[i]); }
      }
      state.items = next;
    }
    persist();
    renderItemsEditor();
    renderPreview();
  });

  function readImage(file, cb) {
    if (!file) { return; }
    if (file.size > 800 * 1024) {
      alert("File maksimal 800 KB agar penyimpanan lokal tetap ringan.");
      return;
    }
    var r = new FileReader();
    r.onload = function () { cb(r.result); };
    r.readAsDataURL(file);
  }

  $("logoInput").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    readImage(f, function (data) {
      state.logo = data;
      refreshLogo();
      persist();
      renderPreview();
    });
  });

  $("logoRemove").addEventListener("click", function () {
    state.logo = "";
    $("logoInput").value = "";
    refreshLogo();
    persist();
    renderPreview();
  });

  $("signInput").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    readImage(f, function (data) {
      state.signature = data;
      refreshSign();
      persist();
      renderPreview();
    });
  });

  $("signRemove").addEventListener("click", function () {
    state.signature = "";
    $("signInput").value = "";
    refreshSign();
    persist();
    renderPreview();
  });

  function doPrint() {
    persist(false);
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
    window.print();
  }
  $("btnPrint").addEventListener("click", doPrint);
  $("btnPrint2").addEventListener("click", doPrint);

  $("btnNew").addEventListener("click", function () {
    if (!confirm("Buat invoice baru? Isi akan dikembalikan ke default Retain.")) { return; }
    state = defaultState();
    fillEditor();
    persist();
    renderAll();
    window.scrollTo(0, 0);
  });

  /* mobile tabs */
  document.body.setAttribute("data-tab", "editor");
  $("tabEditor").addEventListener("click", function () {
    document.body.setAttribute("data-tab", "editor");
    $("tabEditor").className = "tab tab-active";
    $("tabPreview").className = "tab";
  });
  $("tabPreview").addEventListener("click", function () {
    document.body.setAttribute("data-tab", "preview");
    $("tabPreview").className = "tab tab-active";
    $("tabEditor").className = "tab";
  });

  /* init */
  fillEditor();
  renderAll();
})();
