var HTML = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Faktur — Invoice Generator</title>
  <meta name="description" content="Buat invoice profesional, printable, tersimpan lokal. Cloudflare-ready, tanpa build step." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,500;9..144,0,600;9..144,1,500&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="stylesheet" href="./styles.css" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230E7C5B'/><text x='50' y='68' font-size='52' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='800'>F</text></svg>" />
</head>
<body class="antialiased">

  <!-- ===== Top bar (screen only) ===== -->
  <header class="no-print sticky top-0 z-40 border-b border-[#e7e1d3] bg-[#f6f4ef]/90 backdrop-blur">
    <div class="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:px-6">
      <div class="flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-2xl bg-[#0e7c5b] text-xl font-extrabold text-white shadow-[0_8px_20px_-8px_rgba(14,124,91,.7)]">F</div>
        <div class="leading-tight">
          <p class="font-display text-[19px] font-semibold tracking-tight">Faktur<span class="text-[#0e7c5b]">.</span></p>
          <p class="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">Invoice Generator</p>
        </div>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <span id="saveIndicator" class="mr-1 hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-500 sm:flex">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span><span id="saveText">Tersimpan otomatis</span>
        </span>
        <button id="btnNew" class="btn-ghost">Baru</button>
        <button id="btnSaveDraft" class="btn-ghost hidden sm:inline-flex">Simpan draft</button>
        <button id="btnPrint" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Cetak / PDF
        </button>
      </div>
    </div>

    <!-- mobile tab -->
    <div class="mx-auto max-w-[1280px] px-4 pb-3 sm:px-6 lg:hidden">
      <div class="grid grid-cols-2 gap-1 rounded-2xl bg-[#e9e3d3] p-1 text-sm font-bold">
        <button id="tabEditor" class="tab-active rounded-xl px-3 py-2">Editor</button>
        <button id="tabPreview" class="tab-idle rounded-xl px-3 py-2">Preview</button>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-8">
    <div class="grid items-start gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">

      <!-- ================= EDITOR ================= -->
      <section id="editorPane" class="no-print flex flex-col gap-4">

        <!-- Usaha -->
        <div class="card">
          <div class="card-head">
            <div>
              <h2>Profil usaha</h2>
              <p>Ditampilkan di kop invoice.</p>
            </div>
            <span class="step">01</span>
          </div>
          <div class="flex gap-3">
            <label class="logo-box" title="Upload logo">
              <input id="logoInput" type="file" accept="image/*" class="hidden" />
              <img id="logoPreview" alt="" class="hidden h-full w-full rounded-2xl object-contain" />
              <span id="logoPlaceholder" class="flex h-full w-full flex-col items-center justify-center gap-1 text-stone-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
                <span class="text-[11px] font-bold">Logo</span>
              </span>
            </label>
            <div class="grid flex-1 gap-2">
              <input id="bizName" class="field" placeholder="Nama usaha — cth. Retain Studio" />
              <button id="logoRemove" class="hidden text-left text-xs font-bold text-red-600 hover:underline">Hapus logo</button>
              <p class="text-[11px] leading-relaxed text-stone-400">Klik kotak untuk upload. Disimpan sebagai base64 di browser.</p>
            </div>
          </div>
          <div class="mt-3 grid gap-2">
            <textarea id="bizAddress" rows="2" class="field" placeholder="Alamat usaha — Jl. Kemang Raya No. 8, Jakarta Selatan"></textarea>
            <div class="grid grid-cols-2 gap-2">
              <input id="bizPhone" class="field" placeholder="Telepon / WA" />
              <input id="bizEmail" class="field" placeholder="Email usaha" />
            </div>
          </div>
        </div>

        <!-- Klien + Meta -->
        <div class="card">
          <div class="card-head">
            <div><h2>Klien & nomor</h2><p>Siapa yang ditagih & kapan.</p></div>
            <span class="step">02</span>
          </div>
          <div class="grid gap-2">
            <input id="clientName" class="field" placeholder="Nama klien / perusahaan" />
            <textarea id="clientAddress" rows="2" class="field" placeholder="Alamat klien"></textarea>
            <div class="grid grid-cols-2 gap-2">
              <input id="clientEmail" class="field" placeholder="Email klien" />
              <input id="clientPhone" class="field" placeholder="Telepon klien" />
            </div>
          </div>
          <div class="my-3 h-px bg-stone-200/80"></div>
          <div class="grid grid-cols-2 gap-2">
            <label class="lbl">Nomor invoice
              <span class="flex gap-1.5">
                <input id="invNumber" class="field font-mono" />
                <button id="btnRegen" title="Nomor otomatis" class="regen">↻</button>
              </span>
            </label>
            <label class="lbl">Status
              <select id="invStatus" class="field">
                <option>Draft</option>
                <option>Terkirim</option>
                <option>Menunggu bayar</option>
                <option>Lunas</option>
                <option>Jatuh tempo</option>
              </select>
            </label>
            <label class="lbl">Tanggal terbit <input id="invDate" type="date" class="field" /></label>
            <label class="lbl">Jatuh tempo <input id="invDue" type="date" class="field" /></label>
            <label class="lbl col-span-2">Mata uang
              <select id="invCurrency" class="field">
                <option value="IDR" selected>Rupiah — IDR (Rp)</option>
                <option value="USD">US Dollar — USD ($)</option>
                <option value="SGD">Singapore Dollar — SGD (S$)</option>
                <option value="EUR">Euro — EUR (€)</option>
                <option value="MYR">Ringgit — MYR (RM)</option>
                <option value="JPY">Yen — JPY (¥)</option>
                <option value="AUD">Australian Dollar — AUD (A$)</option>
              </select>
            </label>
          </div>
        </div>

        <!-- Items -->
        <div class="card">
          <div class="card-head">
            <div><h2>Rincian tagihan</h2><p>Klik nominal untuk edit langsung.</p></div>
            <span class="step">03</span>
          </div>
          <div id="itemsList" class="grid gap-2"></div>
          <button id="btnAddItem" class="add-item">
            <span class="grid h-6 w-6 place-items-center rounded-full bg-[#0e7c5b] text-white">+</span>
            Tambah baris
          </button>
          <div class="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#faf8f2] p-3 ring-1 ring-stone-200/70">
            <label class="lbl">Diskon
              <span class="flex gap-1.5">
                <input id="discountVal" type="number" min="0" value="0" class="field" />
                <select id="discountType" class="field max-w-[72px]">
                  <option value="percent">%</option>
                  <option value="fixed">Rp</option>
                </select>
              </span>
            </label>
            <label class="lbl">Pajak (%) <input id="taxVal" type="number" min="0" value="11" class="field" /></label>
            <label class="lbl col-span-2">Ongkir / biaya lain <input id="shipVal" type="number" min="0" value="0" class="field" /></label>
          </div>
        </div>

        <!-- Notes -->
        <div class="card">
          <div class="card-head">
            <div><h2>Catatan & pembayaran</h2><p>Info yang muncul di bawah total.</p></div>
            <span class="step">04</span>
          </div>
          <div class="grid gap-2">
            <label class="lbl">Metode pembayaran <input id="payMethod" class="field" placeholder="cth. Transfer BCA 1234567890 a.n. Retain Studio" /></label>
            <label class="lbl">Catatan / syarat <textarea id="invNotes" rows="3" class="field" placeholder="Terima kasih atas kepercayaan Anda. Pembayaran maksimal 14 hari setelah invoice diterbitkan."></textarea></label>
          </div>
        </div>

        <!-- Drafts -->
        <div class="card">
          <div class="card-head">
            <div><h2>Draft tersimpan</h2><p id="draftCount">0 draft di browser ini.</p></div>
            <button id="btnClearDrafts" class="text-xs font-bold text-stone-400 hover:text-red-600">Hapus semua</button>
          </div>
          <div id="draftList" class="grid gap-2"></div>
        </div>

      </section>

      <!-- ================= PREVIEW ================= -->
      <section id="previewPane" class="lg:sticky lg:top-[132px]">
        <div class="no-print mb-3 flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Live preview • A4</p>
          <div class="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span class="hidden sm:inline">Ukuran kertas A4 saat cetak</span>
            <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800"><span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>Otomatis terhitung</span>
          </div>
        </div>

        <!-- Paper -->
        <article id="paper" class="paper">
          <div class="paper-accent"></div>
          <div class="p-7 sm:p-10">
            <!-- kop -->
            <div class="flex items-start justify-between gap-6">
              <div class="flex items-start gap-4">
                <img id="pvLogo" alt="" class="hidden h-14 w-14 rounded-2xl border border-stone-200 object-contain bg-white" />
                <div>
                  <p id="pvBiz" class="font-display text-[22px] font-semibold leading-tight tracking-tight">Nama Usaha Anda</p>
                  <p id="pvBizAddr" class="mt-1 max-w-[300px] whitespace-pre-line text-[12px] leading-relaxed text-stone-500">Alamat usaha</p>
                  <p id="pvBizContact" class="mt-1 text-[12px] font-medium text-stone-500"></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-display text-[34px] font-semibold italic leading-none tracking-tight text-[#131316]">Invoice</p>
                <p id="pvNumber" class="mt-2 font-mono text-[12px] font-bold tracking-wide">INV/2026/IX/001</p>
                <span id="pvStatus" class="status">Draft</span>
              </div>
            </div>

            <!-- meta strip -->
            <div class="mt-7 grid grid-cols-3 gap-3 rounded-2xl bg-[#f6f4ef] p-4 text-[12px] ring-1 ring-[#e7e1d3]">
              <div>
                <p class="meta-lbl">Ditagihkan kepada</p>
                <p id="pvClient" class="meta-val">Nama Klien</p>
                <p id="pvClientAddr" class="meta-sub whitespace-pre-line"></p>
                <p id="pvClientContact" class="meta-sub"></p>
              </div>
              <div>
                <p class="meta-lbl">Tanggal terbit</p>
                <p id="pvDate" class="meta-val">—</p>
                <p class="meta-lbl mt-3">Jatuh tempo</p>
                <p id="pvDue" class="meta-val">—</p>
              </div>
              <div class="text-right">
                <p class="meta-lbl">Total tagihan</p>
                <p id="pvGrand" class="font-display text-[22px] font-semibold tracking-tight text-[#0e7c5b]">Rp 0</p>
                <p id="pvCurrencyNote" class="meta-sub">IDR • Rupiah</p>
              </div>
            </div>

            <!-- table -->
            <table class="mt-6 w-full text-[13px]">
              <thead>
                <tr class="border-b-2 border-[#131316] text-left text-[11px] uppercase tracking-[0.12em] text-stone-500">
                  <th class="py-2.5 pr-2 font-bold">Deskripsi</th>
                  <th class="w-[64px] py-2.5 text-right font-bold">Qty</th>
                  <th class="w-[130px] py-2.5 text-right font-bold">Harga</th>
                  <th class="w-[130px] py-2.5 text-right font-bold">Jumlah</th>
                </tr>
              </thead>
              <tbody id="pvItems"></tbody>
            </table>

            <!-- totals -->
            <div class="mt-5 flex justify-end">
              <dl class="w-full max-w-[280px] space-y-1.5 text-[13px]">
                <div class="flex justify-between text-stone-600"><dt>Subtotal</dt><dd id="pvSub" class="font-semibold tabular-nums">Rp 0</dd></div>
                <div class="flex justify-between text-stone-600"><dt id="pvDiscLbl">Diskon</dt><dd id="pvDisc" class="font-semibold tabular-nums">− Rp 0</dd></div>
                <div class="flex justify-between text-stone-600"><dt id="pvTaxLbl">Pajak (11%)</dt><dd id="pvTax" class="font-semibold tabular-nums">Rp 0</dd></div>
                <div class="flex justify-between text-stone-600"><dt>Ongkir</dt><dd id="pvShip" class="font-semibold tabular-nums">Rp 0</dd></div>
                <div class="mt-2 flex items-center justify-between rounded-2xl bg-[#131316] px-4 py-3 text-white">
                  <dt class="text-[12px] font-bold uppercase tracking-[0.12em]">Total</dt>
                  <dd id="pvTotal" class="font-display text-[18px] font-semibold tabular-nums">Rp 0</dd>
                </div>
              </dl>
            </div>

            <!-- notes -->
            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-dashed border-stone-300 p-4">
                <p class="meta-lbl">Pembayaran</p>
                <p id="pvPay" class="mt-1 whitespace-pre-line text-[12.5px] font-medium leading-relaxed">—</p>
              </div>
              <div class="rounded-2xl border border-dashed border-stone-300 p-4">
                <p class="meta-lbl">Catatan</p>
                <p id="pvNotes" class="mt-1 whitespace-pre-line text-[12.5px] leading-relaxed text-stone-600">—</p>
              </div>
            </div>

            <div class="mt-8 flex items-end justify-between border-t border-stone-200 pt-5">
              <p class="max-w-[320px] text-[11px] leading-relaxed text-stone-400">Terima kasih atas bisnis Anda. Simpan invoice ini sebagai bukti pembayaran yang sah.</p>
              <div class="text-center">
                <p class="text-[11px] font-bold uppercase tracking-widest text-stone-400">Hormat kami</p>
                <div class="mx-auto mt-8 h-px w-36 bg-stone-300"></div>
                <p id="pvSign" class="mt-1 text-[12px] font-bold">( Nama Usaha )</p>
              </div>
            </div>
          </div>
        </article>

        <div class="no-print mt-3 flex flex-wrap gap-2">
          <button id="btnPrint2" class="btn-primary flex-1">Cetak / Simpan PDF</button>
          <button id="btnCopyLink" class="btn-ghost">Salin ringkasan</button>
        </div>
        <p class="no-print mt-2 text-center text-[11px] text-stone-400">Tips: di dialog print pilih “Save as PDF”, aktifkan Background graphics agar warna ikut tercetak.</p>
      </section>
    </div>
  </main>

  <footer class="no-print mx-auto max-w-[1280px] px-4 pb-10 pt-2 text-center text-[11px] text-stone-400 sm:px-6">
    Faktur berjalan 100% lokal — data hanya tersimpan di localStorage browser Anda. Siap deploy ke Cloudflare Workers / Pages.
  </footer>

  <script src="./app.js"></script>
</body>
</html>
`;
var CSS = `:root {
  --paper: #f6f4ef;
  --ink: #131316;
  --accent: #0e7c5b;
  --line: #e7e1d3;
}

html { scroll-behavior: smooth; }
body {
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  background:
    radial-gradient(1100px 380px at 15% -80px, rgba(14,124,91,.10), transparent 60%),
    radial-gradient(900px 340px at 100% 0%, rgba(214,178,94,.14), transparent 55%),
    var(--paper);
  color: var(--ink);
}
.font-display { font-family: "Fraunces", Georgia, serif; }
.font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ---------- editor ---------- */
.card {
  background: #fffdf9;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(19,19,22,.04), 0 18px 40px -30px rgba(19,19,22,.35);
}
.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.card-head h2 { font-weight: 800; font-size: 15px; letter-spacing: -0.01em; }
.card-head p { font-size: 12px; color: #78716c; margin-top: 2px; }
.step {
  font-size: 11px; font-weight: 800; color: #a8a29e;
  border: 1px solid var(--line); border-radius: 999px; padding: 3px 10px; background: #fff;
}
.field {
  width: 100%; font-size: 13.5px; font-weight: 500;
  background: #fff; border: 1.5px solid #e7e1d3; border-radius: 12px;
  padding: 9px 11px; outline: none; transition: border .15s, box-shadow .15s;
  color: var(--ink);
}
.field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(14,124,91,.14); }
.field::placeholder { color: #b8b0a1; font-weight: 500; }
textarea.field { resize: vertical; min-height: 44px; line-height: 1.5; }
.lbl { display: grid; gap: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #78716c; }
.lbl .field { text-transform: none; letter-spacing: normal; }

.logo-box {
  width: 76px; height: 76px; flex: none; cursor: pointer;
  border: 1.5px dashed #d6cfbd; border-radius: 18px; background: #faf8f2;
  overflow: hidden; transition: border .15s, transform .15s;
}
.logo-box:hover { border-color: var(--accent); transform: translateY(-1px); }

.regen {
  flex: none; width: 40px; border-radius: 12px; font-size: 18px; font-weight: 800;
  border: 1.5px solid #e7e1d3; background: #fff; color: #57534e;
}
.regen:hover { border-color: var(--accent); color: var(--accent); }

.add-item {
  margin-top: 10px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 13px; font-weight: 800; color: var(--accent);
  border: 1.5px dashed rgba(14,124,91,.45); background: rgba(14,124,91,.06);
  border-radius: 14px; padding: 10px;
}
.add-item:hover { background: rgba(14,124,91,.11); }

.item-row {
  border: 1.5px solid #ece5d3; border-radius: 16px; background: #fff; padding: 10px;
  display: grid; gap: 8px;
}
.item-row .row-top { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: start; }
.item-row .row-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.mini-lbl { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #a8a29e; display: grid; gap: 4px; }
.icon-btn {
  width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px;
  border: 1px solid #ece5d3; color: #a8a29e; background: #faf8f2; font-size: 15px;
}
.icon-btn:hover { color: #dc2626; border-color: #fecaca; background: #fef2f2; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ink); color: #fff; font-size: 13.5px; font-weight: 800;
  border-radius: 999px; padding: 10px 18px; transition: transform .15s, background .15s;
  box-shadow: 0 12px 24px -12px rgba(19,19,22,.6);
}
.btn-primary:hover { background: #000; transform: translateY(-1px); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 800; color: #44403c;
  border: 1.5px solid var(--line); background: #fffdf9; border-radius: 999px; padding: 9px 15px;
}
.btn-ghost:hover { border-color: var(--ink); }

.tab-active { background: #fffdf9; color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.tab-idle { color: #78716c; }

/* ---------- paper preview ---------- */
.paper {
  position: relative; background: #fff; border-radius: 20px; overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 2px 0 rgba(19,19,22,.04), 0 30px 70px -40px rgba(19,19,22,.45);
}
.paper-accent { height: 8px; background: linear-gradient(90deg, #0e7c5b 0%, #14a87c 45%, #d6b25e 100%); }
.meta-lbl { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: #a8a29e; }
.meta-val { font-size: 13px; font-weight: 800; margin-top: 2px; }
.meta-sub { font-size: 12px; color: #78716c; margin-top: 2px; line-height: 1.5; }
.status {
  display: inline-block; margin-top: 8px; font-size: 10.5px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .1em;
  padding: 4px 11px; border-radius: 999px;
  background: #fef3c7; color: #92400e; border: 1px solid #fcd34d;
}
.status.lunas { background: #dcfce7; color: #166534; border-color: #86efac; }
.status.terkirim, .status.menunggu { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
.status.tempo { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }

#pvItems td { border-bottom: 1px dashed #e7e5e4; padding: 10px 4px; vertical-align: top; }
#pvItems tr:last-child td { border-bottom: none; }

/* draft */
.draft-row {
  display: flex; align-items: center; gap: 10px;
  border: 1px solid #ece5d3; border-radius: 14px; padding: 9px 10px; background: #fff; font-size: 12.5px;
}
.draft-row button { font-weight: 800; }
.draft-empty { font-size: 12.5px; color: #a8a29e; border: 1.5px dashed #e7e1d3; border-radius: 14px; padding: 12px; text-align: center; background: #faf8f2; }

/* ---------- print ---------- */
@media print {
  @page { size: A4; margin: 12mm; }
  body { background: #fff !important; }
  .no-print { display: none !important; }
  main { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  main > div { display: block !important; }
  #previewPane { position: static !important; }
  .paper { border: none !important; border-radius: 0 !important; box-shadow: none !important; }
  .paper-accent { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  #pvGrand, .status, .btn-primary { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  dl .bg-\\[\\#131316\\] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

/* mobile pane toggle */
@media (max-width: 1023px) {
  body[data-tab="preview"] #editorPane { display: none; }
  body[data-tab="editor"] #previewPane { display: none; }
}
`;
var JS = `/* Faktur — Invoice Generator (vanilla JS, localStorage, print-ready) */
(function () {
  "use strict";

  var LS_CURRENT = "faktur:current:v1";
  var LS_DRAFTS = "faktur:drafts:v1";

  var CURRENCIES = {
    IDR: { symbol: "Rp", label: "IDR • Rupiah", locale: "id-ID", digits: 0 },
    USD: { symbol: "$", label: "USD • US Dollar", locale: "en-US", digits: 2 },
    SGD: { symbol: "S$", label: "SGD • Singapore Dollar", locale: "en-SG", digits: 2 },
    EUR: { symbol: "€", label: "EUR • Euro", locale: "de-DE", digits: 2 },
    MYR: { symbol: "RM", label: "MYR • Ringgit", locale: "ms-MY", digits: 2 },
    JPY: { symbol: "¥", label: "JPY • Yen", locale: "ja-JP", digits: 0 },
    AUD: { symbol: "A$", label: "AUD • Australian Dollar", locale: "en-AU", digits: 2 }
  };

  var $ = function (id) { return document.getElementById(id); };

  function uid() { return "it_" + Math.random().toString(36).slice(2, 9); }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addDaysISO(iso, days) {
    var d = iso ? new Date(iso + "T00:00:00") : new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function roman(m) {
    return ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][m] || "";
  }
  function autoNumber() {
    var d = new Date();
    var seq = String(Math.floor(Math.random() * 900) + 100);
    return "INV/" + d.getFullYear() + "/" + roman(d.getMonth()) + "/" + seq;
  }
  function fmtDate(iso) {
    if (!iso) return "—";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }
  function num(v) {
    var n = parseFloat(v);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function money(amount, currency) {
    var c = CURRENCIES[currency] || CURRENCIES.IDR;
    try {
      var s = new Intl.NumberFormat(c.locale, {
        minimumFractionDigits: c.digits,
        maximumFractionDigits: c.digits
      }).format(amount);
      return c.symbol + (c.symbol.length > 1 && /Rp|S\\$|RM|A\\$/.test(c.symbol) ? " " : "") + s;
    } catch (e) {
      return c.symbol + " " + Math.round(amount).toLocaleString("id-ID");
    }
  }

  function blankItem() {
    return { id: uid(), desc: "", qty: 1, price: 0 };
  }

  function defaultState() {
    var t = todayISO();
    return {
      business: { name: "", address: "", phone: "", email: "", logo: "" },
      client: { name: "", address: "", email: "", phone: "" },
      meta: { number: autoNumber(), date: t, due: addDaysISO(t, 14), currency: "IDR", status: "Draft", payment: "", notes: "Terima kasih atas kepercayaan Anda.\\nPembayaran maksimal 14 hari setelah invoice diterbitkan." },
      items: [
        { id: uid(), desc: "Jasa desain / layanan profesional", qty: 1, price: 1500000 },
        { id: uid(), desc: "", qty: 1, price: 0 }
      ],
      discount: { type: "percent", value: 0 },
      tax: 11,
      shipping: 0
    };
  }

  var state = loadCurrent();

  function loadCurrent() {
    try {
      var raw = localStorage.getItem(LS_CURRENT);
      if (!raw) return defaultState();
      var s = JSON.parse(raw);
      if (!s.items || !s.items.length) s.items = [blankItem()];
      if (!s.meta) s.meta = defaultState().meta;
      if (!s.business) s.business = defaultState().business;
      if (!s.client) s.client = defaultState().client;
      return s;
    } catch (e) { return defaultState(); }
  }

  var saveTimer = null;
  function persist(indicate) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(LS_CURRENT, JSON.stringify(state)); } catch (e) {}
      if (indicate !== false) {
        $("saveText").textContent = "Tersimpan " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      }
    }, 350);
  }

  /* ---------- calculations ---------- */
  function calc() {
    var sub = state.items.reduce(function (a, it) { return a + num(it.qty) * num(it.price); }, 0);
    var dVal = num(state.discount.value);
    var disc = state.discount.type === "percent" ? sub * Math.min(dVal, 100) / 100 : Math.min(dVal, sub);
    var taxable = sub - disc;
    var tax = taxable * num(state.tax) / 100;
    var ship = num(state.shipping);
    return { sub: sub, disc: disc, tax: tax, ship: ship, total: taxable + tax + ship };
  }

  /* ---------- editor render ---------- */
  function renderItemsEditor() {
    var box = $("itemsList");
    box.innerHTML = "";
    state.items.forEach(function (it, idx) {
      var row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML =
        '<div class="row-top">' +
          '<label class="mini-lbl">Item ' + (idx + 1) +
            '<input data-k="desc" data-id="' + it.id + '" class="field" placeholder="Deskripsi — cth. Landing page design" value="' + escapeAttr(it.desc) + '" />' +
          "</label>" +
          '<button class="icon-btn" data-del="' + it.id + '" title="Hapus baris">✕</button>' +
        "</div>" +
        '<div class="row-grid">' +
          '<label class="mini-lbl">Qty<input data-k="qty" data-id="' + it.id + '" type="number" min="0" step="any" class="field" value="' + it.qty + '" /></label>' +
          '<label class="mini-lbl">Harga<input data-k="price" data-id="' + it.id + '" type="number" min="0" step="any" class="field" value="' + it.price + '" /></label>' +
          '<label class="mini-lbl">Jumlah<span class="field" style="background:#f6f4ef;font-weight:800">' + money(num(it.qty) * num(it.price), state.meta.currency) + "</span></label>" +
        "</div>";
      box.appendChild(row);
    });
  }

  function escapeAttr(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- preview render ---------- */
  function renderPreview() {
    var cur = state.meta.currency;
    var t = calc();

    $("pvBiz").textContent = state.business.name || "Nama Usaha Anda";
    $("pvBizAddr").textContent = state.business.address || "Alamat usaha";
    var contact = [state.business.phone, state.business.email].filter(Boolean).join("  •  ");
    $("pvBizContact").textContent = contact;
    $("pvSign").textContent = state.business.name ? "( " + state.business.name + " )" : "( Nama Usaha )";

    var logo = $("pvLogo");
    if (state.business.logo) { logo.src = state.business.logo; logo.classList.remove("hidden"); }
    else { logo.removeAttribute("src"); logo.classList.add("hidden"); }

    $("pvNumber").textContent = state.meta.number || "—";
    var st = $("pvStatus");
    st.textContent = state.meta.status || "Draft";
    st.className = "status";
    var s = (state.meta.status || "").toLowerCase();
    if (s === "lunas") st.classList.add("lunas");
    else if (s === "terkirim" || s.indexOf("menunggu") === 0) st.classList.add("terkirim");
    else if (s.indexOf("jatuh") === 0) st.classList.add("tempo");

    $("pvClient").textContent = state.client.name || "Nama Klien";
    $("pvClientAddr").textContent = state.client.address || "";
    $("pvClientContact").textContent = [state.client.email, state.client.phone].filter(Boolean).join("  •  ");
    $("pvDate").textContent = fmtDate(state.meta.date);
    $("pvDue").textContent = fmtDate(state.meta.due);
    $("pvCurrencyNote").textContent = (CURRENCIES[cur] || CURRENCIES.IDR).label;

    var tb = $("pvItems");
    tb.innerHTML = "";
    var rows = state.items.filter(function (it) { return it.desc || num(it.qty) || num(it.price); });
    if (!rows.length) rows = [{ desc: "—", qty: 0, price: 0 }];
    rows.forEach(function (it) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="pr-2"><p class="font-bold">' + (escapeHtml(it.desc) || "—") + "</p></td>" +
        '<td class="text-right tabular-nums text-stone-500">' + escapeHtml(String(it.qty === "" ? "—" : it.qty)) + "</td>" +
        '<td class="text-right tabular-nums text-stone-500">' + money(num(it.price), cur) + "</td>" +
        '<td class="text-right font-extrabold tabular-nums">' + money(num(it.qty) * num(it.price), cur) + "</td>";
      tb.appendChild(tr);
    });

    $("pvSub").textContent = money(t.sub, cur);
    $("pvDisc").textContent = "− " + money(t.disc, cur);
    $("pvDiscLbl").textContent = state.discount.type === "percent"
      ? "Diskon (" + num(state.discount.value) + "%)" : "Diskon";
    $("pvTaxLbl").textContent = "Pajak (" + num(state.tax) + "%)";
    $("pvTax").textContent = money(t.tax, cur);
    $("pvShip").textContent = money(t.ship, cur);
    $("pvTotal").textContent = money(t.total, cur);
    $("pvGrand").textContent = money(t.total, cur);
    $("pvPay").textContent = state.meta.payment || "—";
    $("pvNotes").textContent = state.meta.notes || "—";
  }

  function renderAll() {
    renderItemsEditor();
    renderPreview();
    renderDrafts();
  }

  /* ---------- drafts ---------- */
  function getDrafts() {
    try { return JSON.parse(localStorage.getItem(LS_DRAFTS) || "[]"); }
    catch (e) { return []; }
  }
  function setDrafts(d) {
    try { localStorage.setItem(LS_DRAFTS, JSON.stringify(d)); } catch (e) {}
  }

  function renderDrafts() {
    var drafts = getDrafts();
    $("draftCount").textContent = drafts.length + " draft di browser ini.";
    var box = $("draftList");
    box.innerHTML = "";
    if (!drafts.length) {
      box.innerHTML = '<div class="draft-empty">Belum ada draft. Klik “Simpan draft” untuk menyimpan versi saat ini.</div>';
      return;
    }
    drafts.slice().reverse().forEach(function (d) {
      var row = document.createElement("div");
      row.className = "draft-row";
      var t = calcOf(d.data);
      row.innerHTML =
        '<div class="min-w-0 flex-1"><p class="truncate font-extrabold">' + escapeHtml(d.name) + "</p>" +
        '<p class="truncate text-[11px] text-stone-400">' + escapeHtml(d.data.meta.number || "") + " • " + money(t, d.data.meta.currency) + " • " + escapeHtml(d.savedAt) + "</p></div>" +
        '<button data-load="' + d.id + '" class="rounded-full bg-[#0e7c5b] px-3 py-1.5 text-[11px] text-white">Muat</button>' +
        '<button data-deld="' + d.id + '" class="px-1 text-[15px] text-stone-300 hover:text-red-600">✕</button>';
      box.appendChild(row);
    });
  }

  function calcOf(d) {
    try {
      var sub = d.items.reduce(function (a, it) { return a + num(it.qty) * num(it.price); }, 0);
      var dVal = num(d.discount.value);
      var disc = d.discount.type === "percent" ? sub * Math.min(dVal, 100) / 100 : Math.min(dVal, sub);
      return (sub - disc) * (1 + num(d.tax) / 100) + num(d.shipping);
    } catch (e) { return 0; }
  }

  /* ---------- bindings ---------- */
  function bindField(id, get, set) {
    $(id).addEventListener("input", function (e) { set(e.target.value); persist(); renderPreview(); });
  }

  function fillEditor() {
    $("bizName").value = state.business.name || "";
    $("bizAddress").value = state.business.address || "";
    $("bizPhone").value = state.business.phone || "";
    $("bizEmail").value = state.business.email || "";
    $("clientName").value = state.client.name || "";
    $("clientAddress").value = state.client.address || "";
    $("clientEmail").value = state.client.email || "";
    $("clientPhone").value = state.client.phone || "";
    $("invNumber").value = state.meta.number || "";
    $("invStatus").value = state.meta.status || "Draft";
    $("invDate").value = state.meta.date || todayISO();
    $("invDue").value = state.meta.due || addDaysISO(todayISO(), 14);
    $("invCurrency").value = state.meta.currency || "IDR";
    $("payMethod").value = state.meta.payment || "";
    $("invNotes").value = state.meta.notes || "";
    $("discountVal").value = state.discount.value;
    $("discountType").value = state.discount.type;
    $("taxVal").value = state.tax;
    $("shipVal").value = state.shipping;
    refreshLogo();
  }

  function refreshLogo() {
    var img = $("logoPreview"), ph = $("logoPlaceholder"), rm = $("logoRemove");
    if (state.business.logo) {
      img.src = state.business.logo; img.classList.remove("hidden");
      ph.classList.add("hidden"); rm.classList.remove("hidden");
    } else {
      img.removeAttribute("src"); img.classList.add("hidden");
      ph.classList.remove("hidden"); ph.classList.add("flex"); rm.classList.add("hidden");
    }
  }

  bindField("bizName", null, function (v) { state.business.name = v; });
  bindField("bizAddress", null, function (v) { state.business.address = v; });
  bindField("bizPhone", null, function (v) { state.business.phone = v; });
  bindField("bizEmail", null, function (v) { state.business.email = v; });
  bindField("clientName", null, function (v) { state.client.name = v; });
  bindField("clientAddress", null, function (v) { state.client.address = v; });
  bindField("clientEmail", null, function (v) { state.client.email = v; });
  bindField("clientPhone", null, function (v) { state.client.phone = v; });
  bindField("invNumber", null, function (v) { state.meta.number = v; });
  bindField("payMethod", null, function (v) { state.meta.payment = v; });
  bindField("invNotes", null, function (v) { state.meta.notes = v; });

  $("invStatus").addEventListener("change", function (e) { state.meta.status = e.target.value; persist(); renderPreview(); });
  $("invDate").addEventListener("change", function (e) { state.meta.date = e.target.value; persist(); renderPreview(); });
  $("invDue").addEventListener("change", function (e) { state.meta.due = e.target.value; persist(); renderPreview(); });
  $("invCurrency").addEventListener("change", function (e) { state.meta.currency = e.target.value; persist(); renderAll(); });
  $("discountVal").addEventListener("input", function (e) { state.discount.value = e.target.value; persist(); renderPreview(); });
  $("discountType").addEventListener("change", function (e) { state.discount.type = e.target.value; persist(); renderPreview(); });
  $("taxVal").addEventListener("input", function (e) { state.tax = e.target.value; persist(); renderPreview(); });
  $("shipVal").addEventListener("input", function (e) { state.shipping = e.target.value; persist(); renderPreview(); });

  $("btnRegen").addEventListener("click", function () {
    state.meta.number = autoNumber();
    $("invNumber").value = state.meta.number;
    persist(); renderPreview();
  });

  $("btnAddItem").addEventListener("click", function () {
    state.items.push(blankItem());
    persist(); renderItemsEditor(); renderPreview();
  });

  $("itemsList").addEventListener("input", function (e) {
    var el = e.target;
    var id = el.getAttribute("data-id"), k = el.getAttribute("data-k");
    if (!id || !k) return;
    var it = state.items.find(function (x) { return x.id === id; });
    if (!it) return;
    it[k] = (k === "qty" || k === "price") ? el.value : el.value;
    persist();
    // update line total + totals without full re-render (keep focus)
    renderPreview();
    var label = el.closest(".item-row").querySelector(".row-grid span.field");
    if (label) label.textContent = money(num(it.qty) * num(it.price), state.meta.currency);
  });
  $("itemsList").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-del]");
    if (!btn) return;
    var id = btn.getAttribute("data-del");
    if (state.items.length <= 1) { state.items = [blankItem()]; }
    else { state.items = state.items.filter(function (x) { return x.id !== id; }); }
    persist(); renderItemsEditor(); renderPreview();
  });

  /* logo */
  document.querySelector(".logo-box").addEventListener("click", function () { $("logoInput").click(); });
  $("logoInput").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 600 * 1024) { alert("Logo maksimal 600 KB agar draft tetap ringan."); return; }
    var r = new FileReader();
    r.onload = function () {
      state.business.logo = r.result;
      refreshLogo(); persist(); renderPreview();
    };
    r.readAsDataURL(f);
  });
  $("logoRemove").addEventListener("click", function () {
    state.business.logo = ""; $("logoInput").value = "";
    refreshLogo(); persist(); renderPreview();
  });

  /* actions */
  function doPrint() { persist(false); window.print(); }
  $("btnPrint").addEventListener("click", doPrint);
  $("btnPrint2").addEventListener("click", doPrint);

  $("btnNew").addEventListener("click", function () {
    if (!confirm("Buat invoice baru? Perubahan saat ini sudah tersimpan otomatis.")) return;
    state = defaultState();
    fillEditor(); persist(); renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("btnSaveDraft").addEventListener("click", function () {
    var drafts = getDrafts();
    var name = prompt("Nama draft:", (state.client.name || "Klien") + " — " + (state.meta.number || "invoice"));
    if (name === null) return;
    drafts.push({
      id: uid(),
      name: name || "Draft tanpa nama",
      savedAt: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      data: JSON.parse(JSON.stringify(state))
    });
    while (drafts.length > 20) drafts.shift();
    setDrafts(drafts); renderDrafts();
    $("saveText").textContent = "Draft disimpan ✓";
  });

  $("btnClearDrafts").addEventListener("click", function () {
    if (!confirm("Hapus semua draft tersimpan?")) return;
    setDrafts([]); renderDrafts();
  });

  $("draftList").addEventListener("click", function (e) {
    var l = e.target.closest("[data-load]");
    var d = e.target.closest("[data-deld]");
    var drafts = getDrafts();
    if (l) {
      var found = drafts.find(function (x) { return x.id === l.getAttribute("data-load"); });
      if (found) {
        state = JSON.parse(JSON.stringify(found.data));
        fillEditor(); persist(); renderAll();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (d) {
      setDrafts(drafts.filter(function (x) { return x.id !== d.getAttribute("data-deld"); }));
      renderDrafts();
    }
  });

  $("btnCopyLink").addEventListener("click", function () {
    var t = calc();
    var txt = "Invoice " + state.meta.number + " — " + (state.client.name || "Klien") +
      "\\nTotal: " + money(t.total, state.meta.currency) +
      "\\nJatuh tempo: " + fmtDate(state.meta.due) +
      (state.meta.payment ? "\\nBayar via: " + state.meta.payment : "");
    navigator.clipboard.writeText(txt).then(function () {
      $("btnCopyLink").textContent = "Tersalin ✓";
      setTimeout(function () { $("btnCopyLink").textContent = "Salin ringkasan"; }, 1600);
    });
  });

  /* mobile tabs */
  document.body.dataset.tab = "editor";
  $("tabEditor").addEventListener("click", function () {
    document.body.dataset.tab = "editor";
    $("tabEditor").className = "tab-active rounded-xl px-3 py-2";
    $("tabPreview").className = "tab-idle rounded-xl px-3 py-2";
  });
  $("tabPreview").addEventListener("click", function () {
    document.body.dataset.tab = "preview";
    $("tabPreview").className = "tab-active rounded-xl px-3 py-2";
    $("tabEditor").className = "tab-idle rounded-xl px-3 py-2";
  });

  /* init */
  fillEditor();
  renderAll();
})();
`;
addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);
  var path = url.pathname;
  if (path === "/styles.css") {
    event.respondWith(new Response(CSS, { headers: { "Content-Type": "text/css;charset=UTF-8", "Cache-Control": "public, max-age=3600" } }));
    return;
  }
  if (path === "/app.js") {
    event.respondWith(new Response(JS, { headers: { "Content-Type": "application/javascript;charset=UTF-8", "Cache-Control": "public, max-age=3600" } }));
    return;
  }
  event.respondWith(new Response(HTML, { headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "public, max-age=300" } }));
});
