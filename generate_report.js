const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageBreak,
  LevelFormat, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── THEME COLOURS ───────────────────────────────────────────────────────────
const BLUE_DARK   = "1B3A6B";   // deep navy – headings, header bar
const BLUE_MID    = "2E75B6";   // mid-blue  – sub-headings, table header bg
const BLUE_LIGHT  = "D6E4F0";   // pale blue – alternate table rows
const WHITE       = "FFFFFF";
const GREY_TEXT   = "444444";
const BLACK       = "000000";

// ─── BORDER HELPERS ──────────────────────────────────────────────────────────
const thinBorder = (color = "AAAAAA") => ({ style: BorderStyle.SINGLE, size: 4, color });
const allBorders  = (color = "AAAAAA") => ({
  top: thinBorder(color), bottom: thinBorder(color),
  left: thinBorder(color), right: thinBorder(color)
});

// ─── PARAGRAPH HELPERS ───────────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, color: WHITE, size: 36, font: "Arial" })],
    shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
    spacing: { before: 320, after: 200 },
    indent: { left: 200, right: 200 },
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, color: WHITE, size: 28, font: "Arial" })],
    shading: { fill: BLUE_MID, type: ShadingType.CLEAR },
    spacing: { before: 240, after: 120 },
    indent: { left: 200 },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, color: BLUE_DARK, size: 24, font: "Arial" })],
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE_MID, space: 1 } },
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, color: GREY_TEXT, size: 22, font: "Arial", ...opts })],
    spacing: { before: 60, after: 80 },
  });
}

function bold(text) {
  return new TextRun({ text, bold: true, color: GREY_TEXT, size: 22, font: "Arial" });
}

function spacer(lines = 1) {
  return Array.from({ length: lines }, () =>
    new Paragraph({ children: [new TextRun("")], spacing: { before: 0, after: 0 } })
  );
}

function numberedItem(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    children: [new TextRun({ text, color: GREY_TEXT, size: 22, font: "Arial" })],
    spacing: { before: 40, after: 40 },
  });
}

function bulletItem(text, bold_prefix = "") {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [
      bold_prefix ? new TextRun({ text: bold_prefix, bold: true, color: GREY_TEXT, size: 22, font: "Arial" }) : null,
      new TextRun({ text, color: GREY_TEXT, size: 22, font: "Arial" }),
    ].filter(Boolean),
    spacing: { before: 40, after: 40 },
  });
}

// ─── TABLE BUILDERS ──────────────────────────────────────────────────────────
function makeHeaderCell(text, widthDXA) {
  return new TableCell({
    borders: allBorders(BLUE_MID),
    width: { size: widthDXA, type: WidthType.DXA },
    shading: { fill: BLUE_MID, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, color: WHITE, size: 20, font: "Arial" })]
    })]
  });
}

function makeCell(text, widthDXA, shade = false, centered = false) {
  return new TableCell({
    borders: allBorders("CCCCCC"),
    width: { size: widthDXA, type: WidthType.DXA },
    shading: { fill: shade ? BLUE_LIGHT : WHITE, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, color: GREY_TEXT, size: 20, font: "Arial" })]
    })]
  });
}

// ─── IMAGE HELPER ────────────────────────────────────────────────────────────
function imageRun(filePath, widthPx, heightPx) {
  const data = fs.readFileSync(filePath);
  const ext  = path.extname(filePath).slice(1).toLowerCase();
  return new ImageRun({
    data,
    transformation: { width: widthPx, height: heightPx },
    type: ext === "jpg" ? "jpg" : "png",
  });
}

// ─── INLINE IMAGE PARAGRAPH ──────────────────────────────────────────────────
function imageParagraph(filePath, w, h, caption = "") {
  const items = [];
  if (fs.existsSync(filePath)) {
    items.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [imageRun(filePath, w, h)],
      spacing: { before: 120, after: 60 },
    }));
  } else {
    items.push(body(`[Image not found: ${path.basename(filePath)}]`));
  }
  if (caption) {
    items.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: caption, italics: true, color: BLUE_MID, size: 18, font: "Arial" })],
      spacing: { before: 0, after: 120 },
    }));
  }
  return items;
}

// ─── SUBMISSION CHECKLIST TABLE ──────────────────────────────────────────────
function checklistTable() {
  const widths = [600, 5160, 1200, 2400];
  const total  = widths.reduce((a, b) => a + b, 0);

  const rows_data = [
    ["1", "Student names and IDs included", "✅", ""],
    ["2", "Student ID appended in every device name in Packet Tracer screenshots", "❌", ""],
    ["3", "Task A1: Two subnet designs with intuition (5 marks)", "✅", ""],
    ["4", "Task A1: Design comparison with advantages/disadvantages (2 marks)", "✅", ""],
    ["5", "Task A1: mod 2 student ID → last 8 bits → IP address (2 marks)", "✅", ""],
    ["6", "Task A2: Network configuration with all devices (3 marks)", "✅", ""],
    ["7", "Task A2: Sales server web app via TCP (3 marks)", "✅", ""],
    ["8", "Task A2: IT server UDP real-time service (3 marks)", "✅", ""],
    ["9", "Task A2: DNS query with domain name (2 marks)", "✅", ""],
    ["10", "Task A2: DNS packet monitoring at L2/L3/L4 (2 marks)", "✅", ""],
    ["11", "Task A2: Design choices explanation ≤250 words (2 marks)", "✅", ""],
    ["12", "Task B.1: FCS explanation with 3-5 steps and diagram (3 marks)", "✅", ""],
    ["13", "Task B.2: TCP/IP layer for FCS + integrity explanation (3 marks)", "✅", ""],
    ["14", "Task B.3: TCP vs UDP trade-off example (2 marks)", "✅", ""],
    ["15", "Task C: Clear structure, presentation, referencing (3 marks)", "✅", ""],
    ["16", "Group member contributions table included", "❌", ""],
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      makeHeaderCell("#", widths[0]),
      makeHeaderCell("Requirement", widths[1]),
      makeHeaderCell("Status", widths[2]),
      makeHeaderCell("Double Checked / Verified", widths[3]),
    ]
  });

  const dataRows = rows_data.map((row, i) =>
    new TableRow({
      children: row.map((cell, ci) => makeCell(cell, widths[ci], i % 2 === 1, ci !== 1))
    })
  );

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}

// ─── SUBNET DESIGN 1 TABLE ───────────────────────────────────────────────────
function subnetDesign1Table() {
  const cols = [2340, 2340, 2340, 1620, 720];
  const total = cols.reduce((a, b) => a + b, 0);
  const headers = ["Subnet", "Network Address", "Usable IP Range", "Broadcast Address", "CIDR"];
  const rows_data = [
    ["IT – Subnet 1", "192.100.30.0", "192.100.30.1 – 192.100.30.62", "192.100.30.63", "/26"],
    ["Marketing – Subnet 2", "192.100.30.64", "192.100.30.65 – 192.100.30.126", "192.100.30.127", "/26"],
    ["Administration – Subnet 3", "192.100.30.128", "192.100.30.129 – 192.100.30.190", "192.100.30.191", "/26"],
    ["Sales – Subnet 4", "192.100.30.192", "192.100.30.193 – 192.100.30.254", "192.100.30.255", "/26"],
  ];
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => makeHeaderCell(h, cols[i])) }),
      ...rows_data.map((r, ri) => new TableRow({ children: r.map((c, ci) => makeCell(c, cols[ci], ri % 2 === 1)) }))
    ]
  });
}

// ─── SUBNET DESIGN 2 TABLE ───────────────────────────────────────────────────
function subnetDesign2Table() {
  const cols = [1200, 1200, 1200, 720, 1680, 2040, 1320];
  const total = cols.reduce((a, b) => a + b, 0);
  const headers = ["Department", "Staff (Needed)", "Allocated IPs", "CIDR", "Network Address", "Usable Range", "Broadcast Address"];
  const rows_data = [
    ["IT", "60", "126", "/25", "192.100.30.0", "192.100.30.1 to .126", "192.100.30.127"],
    ["Marketing", "40", "62", "/26", "192.100.30.128", "192.100.30.129 to .190", "192.100.30.191"],
    ["Admin", "40", "62", "/26", "192.100.30.192", "192.100.30.193 to .254", "192.100.30.255"],
    ["Sales", "40", "62", "/26", "192.100.31.0", "192.100.31.1 to .62", "192.100.31.63"],
  ];
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => makeHeaderCell(h, cols[i])) }),
      ...rows_data.map((r, ri) => new TableRow({ children: r.map((c, ci) => makeCell(c, cols[ci], ri % 2 === 1)) }))
    ]
  });
}

// ─── COMPARISON TABLE ────────────────────────────────────────────────────────
function comparisonTable() {
  const cols = [1560, 3900, 3900];
  const total = cols.reduce((a, b) => a + b, 0);
  const headers = ["Design #", "Advantages", "Disadvantages"];
  const rows_data = [
    ["Subnet Design 1",
     "Allows growth (of about 22 users) for Marketing, Admin & Sales; evenly spreads out the allocation per department.",
     "'Fast Growing' IT department does not have much scalability, only having 2 free slots; completely unsuitable for a BYOD environment; definitively lacks capacity for organisational growth."],
    ["Subnet Design 2 (Supernet)",
     "IT department receives /25 (126 addresses) with 66 spare slots; Marketing, Admin, and Sales each receive /26 (62 addresses) with 22 spare slots each; the /23 supernet provides substantial headroom for BYOD; capable of supporting at least 2 devices per person.",
     "Requires ISP permission to supernet beyond the default /24; even 512 addresses may not be sufficient if every staff member uses more than 2 devices simultaneously."],
  ];
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => makeHeaderCell(h, cols[i])) }),
      ...rows_data.map((r, ri) => new TableRow({ children: r.map((c, ci) => makeCell(c, cols[ci], ri % 2 === 1)) }))
    ]
  });
}

// ─── GROUP CONTRIBUTIONS TABLE ───────────────────────────────────────────────
function contributionsTable() {
  const cols = [3120, 1560, 4680];
  const total = cols.reduce((a, b) => a + b, 0);
  const headers = ["Group Member", "Student ID", "Contribution"];
  const rows_data = [
    ["Nikolas Papakalodoukas", "s4094240", ""],
    ["Alexandre Lee", "s4090276", ""],
    ["Thomas Gosling", "s3850201", ""],
    ["Jayden Bolth", "s4104354", ""],
  ];
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => makeHeaderCell(h, cols[i])) }),
      ...rows_data.map((r, ri) => new TableRow({ children: r.map((c, ci) => makeCell(c, cols[ci], ri % 2 === 1)) }))
    ]
  });
}

// ─── REQUIREMENTS TABLE ──────────────────────────────────────────────────────
function requirementsTable() {
  const cols = [2340, 1404, 1404, 1404, 2808];
  const total = cols.reduce((a, b) => a + b, 0);
  const headers = ["Departments", "Marketing", "Administration", "Sales", "IT"];
  const rows_data = [["Requirements", "40", "40", "40", "60 + fast growing"]];
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => makeHeaderCell(h, cols[i])) }),
      ...rows_data.map((r, ri) => new TableRow({ children: r.map((c, ci) => makeCell(c, cols[ci], ri % 2 === 1, ci > 0)) }))
    ]
  });
}

// ─── FCS FLOW DIAGRAM (rendered as image placeholder note) ───────────────────
function fcsFlowDiagram() {
  // Build a simple table-based visual since we can't render mermaid in docx
  const cols = [9360];
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Receiver Error Checking Process (CRC / FCS)", bold: true, color: BLUE_DARK, size: 22, font: "Arial" })],
      spacing: { before: 120, after: 80 },
    }),
    new Table({
      width: { size: 5000, type: WidthType.DXA },
      columnWidths: [5000],
      rows: [
        new TableRow({ children: [new TableCell({
          borders: allBorders(BLUE_MID),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "INPUT: Incoming Frame Bits", bold: true, color: BLUE_DARK, size: 20, font: "Arial" })] })]
        })] }),
        new TableRow({ children: [new TableCell({
          borders: allBorders(BLUE_MID),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "▼", color: BLUE_MID, size: 20, font: "Arial" })] })] 
        })] }),
        new TableRow({ children: [new TableCell({
          borders: allBorders(BLUE_MID),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Perform polynomial division on full frame data using the network's configured generator", color: GREY_TEXT, size: 20, font: "Arial" })] })]
        })] }),
        new TableRow({ children: [new TableCell({
          borders: allBorders(BLUE_MID),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "▼", color: BLUE_MID, size: 20, font: "Arial" })] })] 
        })] }),
        new TableRow({ children: [new TableCell({
          borders: allBorders("FFD700"),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: "FFFDE7", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "DECISION: Does Calculated Remainder == 0?", bold: true, color: "7B6000", size: 20, font: "Arial" })] })]
        })] }),
        new TableRow({ children: [new TableCell({
          borders: allBorders(BLUE_MID),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "  YES (No Errors)  →  ", color: "2E7D32", size: 20, font: "Arial", bold: true }),
              new TextRun({ text: "OUTPUT: Accept Frame, pass to next node", color: GREY_TEXT, size: 20, font: "Arial" }),
            ] })]
        })] }),
        new TableRow({ children: [new TableCell({
          borders: allBorders(BLUE_MID),
          width: { size: 5000, type: WidthType.DXA },
          shading: { fill: WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "  NO  (Error Detected)  →  ", color: "C62828", size: 20, font: "Arial", bold: true }),
              new TextRun({ text: "OUTPUT: Discard Frame (silent drop)", color: GREY_TEXT, size: 20, font: "Arial" }),
            ] })]
        })] }),
      ]
    }),
  ];
}

// ─── MAIN DOCUMENT BUILDER ───────────────────────────────────────────────────
const imgBase = path.join(__dirname, "A2_Screenshots");

// We only have one image locally; reference the others by filename for placeholders
const IMGS = {
  salesWebApp: path.join(imgBase, "589350447-b0ae3774-9fdc-46fc-8205-40e66df0653b.png"),
};

function imgOrNote(filePath, w, h, caption) {
  if (fs.existsSync(filePath)) return imageParagraph(filePath, w, h, caption);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `[ Screenshot: ${path.basename(filePath)} ]`, italics: true, color: BLUE_MID, size: 20, font: "Arial" })],
      shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
      spacing: { before: 120, after: 120 },
      border: { top: thinBorder(BLUE_MID), bottom: thinBorder(BLUE_MID), left: thinBorder(BLUE_MID), right: thinBorder(BLUE_MID) },
    }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: caption, italics: true, color: BLUE_MID, size: 18, font: "Arial" })],
      spacing: { before: 0, after: 120 }
    }),
  ];
}

const children = [

  // ═══════════════════════════════════════════════════════════════════════════
  // COVER / TITLE SECTION
  // ═══════════════════════════════════════════════════════════════════════════
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Data Communication and Net-Centric Computing", bold: true, color: BLUE_DARK, size: 52, font: "Arial" })],
    spacing: { before: 480, after: 120 },
    shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Group Assignment 2", bold: true, color: BLUE_MID, size: 40, font: "Arial" })],
    spacing: { before: 0, after: 360 },
    shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE_DARK, space: 1 } },
    children: [new TextRun({ text: "Group 33", bold: true, color: BLUE_DARK, size: 28, font: "Arial" })],
    spacing: { before: 0, after: 200 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Nikolas Papakalodoukas  (s4094240)   |   Alexandre Lee  (s4090276)", color: GREY_TEXT, size: 22, font: "Arial" })],
    spacing: { before: 100, after: 60 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Thomas Gosling  (s3850201)   |   Jayden Bolth  (s4104354)", color: GREY_TEXT, size: 22, font: "Arial" })],
    spacing: { before: 0, after: 480 },
  }),

  // PAGE BREAK
  new Paragraph({ children: [new PageBreak()] }),

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBMISSION CHECKLIST
  // ═══════════════════════════════════════════════════════════════════════════
  h1("Submission Checklist"),
  ...spacer(1),
  checklistTable(),
  ...spacer(2),

  // PAGE BREAK
  new Paragraph({ children: [new PageBreak()] }),

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK A
  // ═══════════════════════════════════════════════════════════════════════════
  h1("Task A"),
  body("Car Sales Melbourne City has recently relocated from Richmond. The company consists of four main departments: Marketing, Administration, IT, and Sales. Currently, each of Marketing, Administration and Sales departments has 40 staff, while the fast-growing IT department has 60 staff. Assume that the company has been assigned the IP address 192.100.30.0. As a networking engineer at Car Sales Melbourne City, your task is to design and implement a new private network for the company."),

  // A1
  h2("Task A1: Designing Potential Subnets 1, 2, 3 and 4"),
  h3("1. Subnet Designs (9 marks)"),
  body("Departmental requirements:"),
  requirementsTable(),
  ...spacer(1),

  // ─── Design 1
  h3("Subnet Design 1"),
  body("Design 1 utilises a FSLM approach, subdividing the network into 4 subnets of equal size, using 26 bits for the network address and giving each subnetwork a total of 62 hosts each."),
  body("Since each department is provisioned with only 2 PCs by default, it is highly probable that Car Sales Melbourne City accommodates a BYOD (Bring Your Own Device) work environment, suggesting that staff will require IP addresses for multiple devices (e.g., laptop and smartphone). Because of this, Design 1 does not provide sufficient room for growth or a BYOD environment; with only 62 addresses per subnet and 40 staff per department, only 22 spare addresses remain. This is inadequate for the fast-growing IT department (which would have only 2 spare addresses) and cannot support multiple devices per person in a BYOD workplace."),
  subnetDesign1Table(),
  ...spacer(1),

  // ─── Design 2
  h3("Subnet Design 2: Supernet Configuration"),
  body("The IP address assigned to Car Sales Melbourne City, 192.100.30.0, is a public Class C address belonging to RIPE NCC (Réseaux IP Européens Network Coordination Centre). By default, a Class C address implies a /24 subnet mask, providing 255 total addresses (254 usable). However, given the staffing requirements across all four departments, a total of 180 staff require network access — approximately 70% utilisation of the 255 available addresses if one device per person is assumed."),
  body("Furthermore, RIPE NCC stipulates that 80% of a reasonable allocation must be utilised before additional allocations can be granted. The aforementioned BYOD environment justifies the 80% minimum requirement for additional allocation, as the actual address demand per person is likely to exceed one device."),
  body("Given these considerations, a /23 supernet (512 addresses) is necessary. However, even 512 addresses may not be sufficient to accommodate at least 2 devices per person (computer and phone) across all departments simultaneously. Therefore, additional measures such as IP address recycling will need to be employed to manage the address space efficiently."),
  body("To accommodate this, permission from the ISP to supernet must be requested. RIPE NCC policy requires that at least 50% of the current allocation must be utilised within one year, otherwise the allocation may be downgraded. Assuming two devices per person, the 70% utilisation threshold is comfortably exceeded, justifying the need for additional address space."),
  subnetDesign2Table(),
  ...spacer(1),
  body("This configuration allocates a /25 (126 usable addresses) to the fast-growing IT department, providing ample room for expansion, while each of the remaining three departments receives a /26 (62 usable addresses). The supernet spans from 192.100.30.0/23 to 192.100.31.255/23, effectively aggregating the four subnets under a single supernet prefix."),

  // ─── Comparison
  h3("2. Subnet Design Comparison: Advantages and Disadvantages"),
  comparisonTable(),
  ...spacer(1),
  body("In my opinion, Subnet Design 2 (Supernet) is the superior choice. Design 1 is fundamentally flawed for this organisation because it allocates only 62 addresses per subnet, leaving the IT department with a mere 2 spare addresses and the other departments with 22 each. This is completely inadequate for a BYOD work environment, as even one additional device per person would immediately exhaust the IT subnet and severely strain the others."),
  body("In contrast, Design 2's supernet approach leverages a /23 block (512 addresses) obtained through ISP permission, justified by the 70% utilisation of the original /24 and the BYOD-driven demand for multiple devices per person. The IT department receives a /25 (126 addresses and 66 spare), while Marketing, Admin, and Sales each receive a /26 (62 addresses and 22 spare each). This configuration provides ample room for departmental growth and comfortably supports at least 2 devices per staff member, and aligns with RIPE NCC's 50% minimum utilisation policy."),

  // ─── IP Address Calculation
  h3("3. Deciding the IP Address from Mod 2 Operation of Nikolas' Student ID"),
  body("Goal: Nikolas' student ID: s4094240, converted to 4094240, then mod 2"),
  ...spacer(1),
  numberedItem("4094240 mod 2 = 0, quotient: 2047120"),
  numberedItem("2047120 mod 2 = 0, quotient: 1023560"),
  numberedItem("1023560 mod 2 = 0, quotient: 511780"),
  numberedItem("511780 mod 2 = 0, quotient: 255890"),
  numberedItem("255890 mod 2 = 0, quotient: 127945"),
  numberedItem("127945 mod 2 = 1, quotient: 63972"),
  numberedItem("63972 mod 2 = 0, quotient: 31986"),
  numberedItem("31986 mod 2 = 0, quotient: 15993"),
  ...spacer(1),
  body("The first bit calculated is the least significant bit."),
  body("First 8 bits (LSB first): 0 0 1 0 0 0 0 0 = 32"),
  new Paragraph({
    children: [new TextRun({ text: "IP address: 192.100.30.32", bold: true, color: BLUE_DARK, size: 24, font: "Arial" })],
    spacing: { before: 120, after: 80 },
  }),
  body("192.100.30.32 falls within the IT department subnet (192.100.30.0/25), which has usable hosts ranging from 192.100.30.1 to 192.100.30.126, and a broadcast address of 192.100.30.127."),

  // PAGE BREAK
  new Paragraph({ children: [new PageBreak()] }),

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK A2
  // ═══════════════════════════════════════════════════════════════════════════
  h2("Task A2: Implement Subnet Design Using Packet Tracer v8.2.2"),

  h3("1. Network Configuration"),
  body("The network's architecture consists of a router, a central core switch, and switches for all four departments. Each department contains its own server and employee PCs; the IT department's network contains a printer. VLSM subnetting is used to allocate IP addresses efficiently according to departmental requirements while reducing address wastage and supporting future scalability, and communication between subnets is done through inter-VLAN routing, configured on the router using router-on-a-stick."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/589351077-0dba03e9-6df1-4772-94db-359b98ef4716.png"), 560, 350, "Figure 1: Network Architecture"),

  body("VLAN segmentation is the basis of the subnet design. It separates each department into their own broadcast domain to reduce unnecessary broadcast traffic between departments, minimise congestion in direct Layer 2 communication and isolate departmental resources. Trunk links between the core switch and departmental switches allow multiple VLANs to traverse the network while maintaining separation."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592891048-51c21e46-a4dd-4660-8a1c-8247872342ef.png"), 380, 300, "Figure 2: VLAN Segmentation Configuration"),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592893774-a5f26add-2208-4109-9f4a-d2de23e59e34.png"), 380, 300, "Figure 3: VLAN Demonstration"),

  h3("2. Application Service Configuration"),
  body("Sales Server Web Application:"),
  body("The Sales server is configured to host a web application using the HTTP service, which operates over TCP. The web application was built with HTML. The application was tested from a PC in another department by entering the Sales server IP address, 192.100.31.5, into the web browser. The page loaded successfully, confirming that the Sales server's HTTP service is active and reachable across the routed network. This also verifies that TCP-based application traffic can travel between departmental VLANs through the router."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592907618-834180bd-589e-42d8-be84-01e8ab5a2f73.png"), 380, 280, "Figure 4: Sales Server HTTP Service Configuration"),
  ...imageParagraph(IMGS.salesWebApp, 560, 380, "Figure 5: Sales Department Web Application (accessed from IT_PC1 via http://192.100.31.2)"),

  body("IT Server Web Application and UDP Simulation:"),
  body("The IT department server was configured to support simulated real-time communication using UDP traffic within Packet Tracer. A complex PDU was created from a client device in the Sales department and configured to send periodic UDP packets to the IT server every one second. The configuration used destination port 53 and a custom source port to demonstrate continuous UDP packet transmission between devices across VLANs."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592906022-326da72b-020c-4f47-a92c-01d34da623de.png"), 480, 320, "Figure 6: IT Server UDP Service Configuration"),
  body("The UDP simulation was verified in the Simulation Mode by monitoring packets arriving at the IT department server. The OSI Model view confirms UDP communication at Layer 4 using source port 50000 and destination port 53, while Layer 3 displays the source and destination IP addresses."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592906715-aee5ca6a-4e0c-4c3c-a2a8-cbc303729804.png"), 480, 320, "Figure 7: UDP Simulation Verification in Simulation Mode"),

  h3("3. DNS Query Demonstrations"),
  body("The IT department server was configured as a DNS server by creating an A Record that mapped the domain name www.sales.com to the Sales server IP address 192.100.31.2. A client device in the Marketing department then initiated a DNS query using the domain name rather than the direct IP address. A successful ping response confirmed that the DNS service correctly resolved the domain name to the destination server. The web application hosted on the Sales server was then successfully accessed through the web browser using the configured domain name, demonstrating functional DNS resolution and inter-VLAN connectivity."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592899863-612aa5c8-003a-4d63-bf80-82b992805130.png"), 380, 300, "Figure 8: IT Server DNS Configuration"),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592900200-32e52f55-3f63-4bb0-9234-0c00f8361ca2.png"), 380, 300, "Figure 9: Client DNS Query from Marketing PC"),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592900506-4c5f4535-4e5f-450a-9d9e-5d73e0e1cbac.png"), 380, 300, "Figure 10: DNS Connection Confirmation"),

  body("Observing OSI Layers:"),
  body("The DNS query was monitored using Packet Tracer Simulation Mode to analyse packet flow across the OSI model. The captured packet shows DNS operating at Layer 7 and UDP communication at Layer 4 using source and destination port 53. Layer 3 displays the source and destination IP addresses, while Layer 2 shows the Ethernet frame and MAC address information used for local delivery."),
  ...imgOrNote(path.join(imgBase, "A2_Screenshots/592902335-8301bd5d-326f-4b16-af9d-a6b590e888ba.png"), 520, 380, "Figure 11: DNS Packet OSI Layer Analysis in Simulation Mode"),

  h3("4. Network Design Choices Explanation"),
  body("The network topology was designed using a hierarchical structure with a central core switch, connected to the switches for each department. This approach keeps the network organised by segmenting the departments, and makes it easier to manage and troubleshoot by limiting backbone connections to the router to one switch (central core). Each department was separated into its own VLAN to reduce unnecessary broadcast traffic and improve security by routing interdepartmental communication through the router. VLSM subnetting was utilised for efficient IP allocation according to departmental requirements, which reduced address wastage while supporting future scalability."),
  body("A router-on-a-stick configuration was used to enable inter-VLAN communication while avoiding the need for multiple physical router interfaces. Trunk links were configured between the core switch, router, and departmental switches so that traffic from multiple VLANs could travel across a single connection efficiently."),
  body("Servers were placed within their relevant departments to reflect realistic business usage. The Sales server hosted the web application, while the IT server provided DNS and simulated UDP-based services. Static IP addressing was employed so that key devices such as servers, printers, and networking equipment always remain accessible at known addresses."),
  body("The overall design improves scalability as the modular nature of the network allows for additional departments, VLANs, or devices without overhauling the entire network. The topology provides a network that is simple, organised, secure, and allows for efficient communications."),

  // PAGE BREAK
  new Paragraph({ children: [new PageBreak()] }),

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK B
  // ═══════════════════════════════════════════════════════════════════════════
  h1("Task B"),

  h2("B.1 — Frame Check Sequence (FCS) Error Detection"),
  body("List 3-5 steps to explain how the frame check sequence (FCS) is used for error detection. Draw a figure to show how the receiver checks the error."),
  ...spacer(1),

  h3("Frame Check Sequence Explanation"),
  body("The frame check sequence is a trailer field in a frame that is populated by an algorithm, in this case CRC, and the field value is used to validate the data integrity of the frame. The CRC algorithm takes the numeric binary value of the entire frame and divides it by a fixed binary divisor (Generator), determined by the network standard being used, appending the remainder (the FCS value) to the trailer of the frame in the specific FCS field. The fixed binary divisor has a most significant bit of 1."),
  ...spacer(1),

  new Paragraph({ children: [new TextRun({ text: "Sender steps to calculate FCS value with CRC:", bold: true, color: BLUE_DARK, size: 22, font: "Arial" })], spacing: { before: 80, after: 60 } }),
  numberedItem("Append k - 1 zeroes to the data, where k is the length of the generator's binary value. This will be referred to as the padded data."),
  numberedItem("Take the first k bits of the padded data (the sliding window) and perform polynomial division with the generator. If the most significant bit of the result is not 1, drop the leading zeroes and append the next n bits from the padded data. Repeat until there are no more bits to append; the remainder is the FCS value."),
  numberedItem("Replace the trailing zeroes in the padded data with the k - 1 least significant bits of the remainder to produce the final frame with the FCS value added to the trailer."),
  ...spacer(1),

  new Paragraph({ children: [new TextRun({ text: "Receiver steps to validate FCS with CRC:", bold: true, color: BLUE_DARK, size: 22, font: "Arial" })], spacing: { before: 80, after: 60 } }),
  numberedItem("Perform sliding window polynomial division on the frame data using the same generator which should be used ubiquitously by all network nodes."),
  numberedItem("If the remainder from the polynomial division is zero then the FCS value is valid and the frame can be accepted. If the remainder is non-zero, the frame is silently discarded."),
  ...spacer(1),

  h3("Receiver Error Checking Process Diagram"),
  ...fcsFlowDiagram(),
  ...spacer(1),

  // ─── B.2
  h2("B.2 — TCP/IP Layer Association with FCS"),
  body("Which layer of the TCP/IP model associates with the FCS? Based on the figure in Task B.1, explain how to ensure integrity in that layer."),
  ...spacer(1),
  new Paragraph({
    children: [
      new TextRun({ text: "The Frame Check Sequence (FCS)", bold: true, color: GREY_TEXT, size: 22, font: "Arial" }),
      new TextRun({ text: " is a trailer field in frames of the ", color: GREY_TEXT, size: 22, font: "Arial" }),
      new TextRun({ text: "Network Access Layer", bold: true, color: BLUE_DARK, size: 22, font: "Arial" }),
      new TextRun({ text: " of the TCP/IP model, specifically in the ", color: GREY_TEXT, size: 22, font: "Arial" }),
      new TextRun({ text: "MAC (Media Access Control) sublayer", bold: true, color: BLUE_DARK, size: 22, font: "Arial" }),
      new TextRun({ text: ". The NIC hardware handles CRC computation and FCS validation on-the-fly as frames are transmitted and received; no higher-layer software is involved in the per-hop integrity check.", color: GREY_TEXT, size: 22, font: "Arial" }),
    ],
    spacing: { before: 60, after: 80 },
  }),
  body("Referring to the B.1 diagram, integrity is ensured as follows:"),
  numberedItem("FCS integrity is checked by every intermediate Network Access Layer node (switch, router interface) that receives the frame, not just at the final destination."),
  numberedItem("The CRC algorithm is designed so that when the receiver divides the entire incoming bit-string (data + FCS) by the generator polynomial, a zero remainder signals an intact frame — the 'Yes (No errors)' branch in the B.1 diagram, leading to the frame being accepted and passed up the stack."),
  numberedItem("If the comparison yields a non-zero remainder (the 'No (Corruption detected)' branch), the frame is silently dropped because the network access layer adheres to the end-to-end principle and a best effort quality of service policy. Wired connections are dropped silently while wireless connections will locally retransmit within Layer 2 if an acknowledgement isn't received. Recovery is then delegated to the relevant transport-layer protocol: if TCP, the receiving host's TCP stack will notice a gap in sequence numbers and trigger retransmission; if UDP, recovery is delegated to the application."),

  // PAGE BREAK
  new Paragraph({ children: [new PageBreak()] }),

  // ─── B.3
  h2("B.3 — Transport Layer Protocol Trade-off"),
  body("Give an example to discuss how to trade-off the reliable data transmission and minimise latency when selecting the Transport layer protocols."),
  ...spacer(1),
  body("When transmitting data there is an inherent tradeoff between reliability and latency. For a connection to be reliable the sender must ensure the data is received uncorrupted. However, confirming this requires a response from the receiver, introducing latency that may increase depending on the size of the data."),
  body("Consider the use case of a video conference livestream. If TCP was used, waiting for the receiver to verify that each packet is received uncorrupted would make continuously streaming video slow and conversation between participants impossible due to unbearable latency. This is why UDP is the standard for live streaming; it drops the handshake, discards out of sequence packets and never retransmits, leaving the application to fill in the gaps. The absence of a handshake and sequence buffering significantly reduces latency but frames are discarded and lost more frequently. This tradeoff is necessary for the user experience in livestreaming, especially for two-way communication."),
  body("Conversely, the use of TCP for downloading a video would be more appropriate to make sure that all downloaded packets are captured and sequenced to form the complete file. UDP would not be appropriate for this type of download because the received data is not guaranteed to be complete and packets that are received out of sequence would be dropped and may not be retransmitted (Gough 2025)."),

  // PAGE BREAK
  new Paragraph({ children: [new PageBreak()] }),

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP MEMBER CONTRIBUTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  h1("Group Member Contributions"),
  ...spacer(1),
  contributionsTable(),
  ...spacer(2),

  // ═══════════════════════════════════════════════════════════════════════════
  // REFERENCES
  // ═══════════════════════════════════════════════════════════════════════════
  h1("References"),
  body("GeeksforGeeks 2026, Difference between CRC and FCS, GeeksforGeeks, accessed 15 May 2026. https://www.geeksforgeeks.org/computer-networks/what-is-the-difference-between-crc-and-fcs/"),
  body("Gough H 2025, 'UDP vs TCP: What's the difference?', Norton, 11 December, accessed 16 May 2026. https://us.norton.com/blog/wifi/udp-vs-tcp"),
  body("RIPE NCC 2026, RIPE Document 504: Address Space Managed by the RIPE NCC, RIPE NCC, accessed 8 May 2026. https://www.ripe.net/publications/docs/ripe-504/"),
  body("RIPE NCC 2026b, RIPE Document 484: IPv4 Address Allocation and Assignment Policies, diff from RIPE-622, RIPE NCC, accessed 8 May 2026. https://www.ripe.net/publications/docs/ripe-484/diff/ripe-622/"),
  body("Wikipedia 2026a, 'Cyclic redundancy check', Wikipedia, accessed 16 May 2026. https://en.wikipedia.org/wiki/Cyclic_redundancy_check"),
  body("Wikipedia 2026b, 'End-to-end principle', Wikipedia, accessed 16 May 2026. https://en.wikipedia.org/wiki/End-to-end_principle"),
];

// ─── ASSEMBLE DOCUMENT ───────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: GREY_TEXT } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: WHITE },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: WHITE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Data Communication and Net-Centric Computing  |  Group 33", color: WHITE, bold: true, size: 18, font: "Arial" }),
            ],
            alignment: AlignmentType.LEFT,
            shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
            spacing: { before: 100, after: 100 },
            indent: { left: 200, right: 200 },
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Group Assignment 2  |  Nikolas Papakalodoukas, Alexandre Lee, Thomas Gosling, Jayden Bolth", color: BLUE_MID, size: 16, font: "Arial" }),
            ],
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE_MID, space: 1 } },
            spacing: { before: 100 },
          })
        ]
      })
    },
    children,
  }]
});

const outDir = path.join(__dirname, "output");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(path.join(outDir, "TaskC_Report.docx"), buf);
  console.log("Done: TaskC_Report.docx");
});
