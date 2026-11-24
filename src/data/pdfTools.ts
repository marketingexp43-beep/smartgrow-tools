export type PdfCategoryId =
  | 'organize-pdf'
  | 'optimize-pdf'
  | 'convert-pdf'
  | 'edit-pdf'
  | 'pdf-security'
  | 'pdf-intelligence';

export interface PdfCategoryMeta {
  id: PdfCategoryId;
  name: string;
  description: string;
  accentTone: 'blue' | 'purple';
}

export interface PdfToolFaq {
  question: string;
  answer: string;
}

export interface PdfToolDefinition {
  id: string;
  slug: string;
  path: string;
  name: string;
  categoryId: PdfCategoryId;
  categoryName: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  howItWorks: string[];
  bestPractices: string[];
  faqs: PdfToolFaq[];
  limitationNote?: string;
}

export const PDF_CATEGORIES: PdfCategoryMeta[] = [
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    description:
      'Combine multiple PDFs, split ranges, reorder visual page thumbnails, delete or extract pages, rotate orientation, and stamp page numbers.',
    accentTone: 'blue',
  },
  {
    id: 'optimize-pdf',
    name: 'Optimize PDF',
    description:
      'Reduce PDF file sizes with lossless structure packing or image compression, and attempt local structural recovery on damaged PDFs.',
    accentTone: 'purple',
  },
  {
    id: 'convert-pdf',
    name: 'Convert PDF',
    description:
      'Export PDF pages to crisp JPG or PNG images, combine photos into PDFs, and convert between editable DOCX documents and PDF locally.',
    accentTone: 'blue',
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description:
      'Add custom text annotations, overlay logos or images, stamp text or image watermarks, apply drawn or typed signatures, and crop margins.',
    accentTone: 'purple',
  },
  {
    id: 'pdf-security',
    name: 'PDF Security',
    description:
      'Encrypt PDF documents with strong user passwords and permission controls, or remove password protection when you supply the password.',
    accentTone: 'blue',
  },
  {
    id: 'pdf-intelligence',
    name: 'PDF Intelligence',
    description:
      'Extract selectable text cleanly, run browser-based OCR on scanned PDFs, and prepare or run on-device text translation without uploading files.',
    accentTone: 'purple',
  },
];

export const PDF_TOOLS: PdfToolDefinition[] = [
  // 1. ORGANIZE PDF (7 tools)
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    path: '/pdf-tools/merge-pdf',
    name: 'Merge PDF',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Combine two or more PDF documents into one ordered file directly in your browser.',
    seoTitle: 'Merge PDF Files Online Free – Private Browser Combiner | SmartGrow Tools',
    seoDescription:
      'Merge multiple PDF documents into a single organized file locally in your browser with drag-and-drop reordering and zero server uploads.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf combiner'],
    howItWorks: [
      'Select or drop two or more PDF files from your device.',
      'Use the Up and Down controls to arrange the exact document order for the combined file.',
      'Click Merge PDF Files to assemble all pages locally and download the finished document.',
    ],
    bestPractices: [
      'Check page counts beside each uploaded file to verify no blank or unintended documents slipped into the queue.',
      'Keep filenames descriptive before merging so it is easy to order multi-chapter reports or invoices accurately.',
      'Run Compress PDF afterward if your combined document contains large scanned images for email sharing.',
    ],
    faqs: [
      {
        question: 'Are my PDF files uploaded to a server when merging?',
        answer:
          'No. Merging runs completely inside your browser memory using open-source pdf-lib JavaScript processing, so your private documents stay on your device.',
      },
      {
        question: 'Does Merge PDF reduce image or text quality?',
        answer:
          'No. Pages are copied structurally without rasterizing text or recompressing embedded images, preserving original vector crispness.',
      },
      {
        question: 'Can I merge password-protected PDFs?',
        answer:
          'Encrypted PDFs must be unlocked first using Unlock PDF with your authorized password before their pages can be combined.',
      },
    ],
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    path: '/pdf-tools/split-pdf',
    name: 'Split PDF',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Divide a PDF into individual page files, fixed page chunks, or custom ranges.',
    seoTitle: 'Split PDF Pages Online Free – Extract Ranges or ZIP | SmartGrow Tools',
    seoDescription:
      'Split a multi-page PDF into single pages, equal chunks, or custom page ranges locally in your browser and download as PDF or ZIP.',
    keywords: ['split pdf', 'separate pdf pages', 'divide pdf', 'pdf splitter'],
    howItWorks: [
      'Upload the PDF file you want to split and inspect its total page count.',
      'Pick a split mode: every page individually, fixed chunks (such as every 2 pages), or custom comma-separated ranges like 1-3, 4-6.',
      'Click Split PDF to generate the separated documents and download a single PDF or an organized ZIP archive.',
    ],
    bestPractices: [
      'Use custom ranges (for example, 1-2, 3-8, 9-12) when dividing chapters, invoices, or multi-applicant packets.',
      'Check the page count displayed after upload so your highest page range stays within the document length.',
      'When splitting dozens of single pages, download the generated ZIP archive to keep all numbered files tidy.',
    ],
    faqs: [
      {
        question: 'How should I format custom page ranges when splitting?',
        answer:
          'Separate each output file with a comma, such as 1-3, 4-6, 7. Each group creates its own PDF document containing those exact pages in order.',
      },
      {
        question: 'Can I split one PDF into single-page PDFs all at once?',
        answer:
          'Yes. Choose Split Every Page and the tool bundles each page as a cleanly named PDF inside one convenient ZIP download.',
      },
      {
        question: 'Are bookmarks or fonts preserved in split segments?',
        answer:
          'Page text, vector artwork, images, and embedded fonts required by the pages in each split file are preserved.',
      },
    ],
  },
  {
    id: 'organize-pdf-pages',
    slug: 'organize-pdf-pages',
    path: '/pdf-tools/organize-pdf-pages',
    name: 'Organize PDF Pages',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Visually reorder, duplicate, rotate, and remove pages using live page thumbnails.',
    seoTitle: 'Organize PDF Pages Visually – Reorder & Arrange Free | SmartGrow Tools',
    seoDescription:
      'Rearrange PDF page order, rotate single pages, duplicate slides, and remove unwanted sheets using live browser page thumbnails.',
    keywords: ['organize pdf', 'reorder pdf pages', 'rearrange pdf', 'sort pdf pages'],
    howItWorks: [
      'Drop a PDF to render crisp visual thumbnails for every page in your browser.',
      'Move pages earlier or later, duplicate important pages, rotate individual sheets 90°, or remove unwanted pages.',
      'Click Save Organized PDF to rebuild and download the updated document.',
    ],
    bestPractices: [
      'Use Reverse Order when a document scanner fed double-sided sheets backwards.',
      'Duplicate a cover or divider page right inside the grid before exporting.',
      'Check rotated pages visually before downloading to ensure landscape tables align correctly.',
    ],
    faqs: [
      {
        question: 'Can I reorder and rotate pages at the same time?',
        answer:
          'Yes. Each page thumbnail includes quick controls to move left/right, rotate 90 degrees, duplicate, or remove before saving once.',
      },
      {
        question: 'How are the page thumbnails generated?',
        answer:
          'Thumbnails are rendered locally on HTML5 canvases using Mozilla PDF.js without sending page previews anywhere online.',
      },
      {
        question: 'Is there a strict page cap?',
        answer:
          'Very large PDFs (100+ pages) take a few seconds longer to render thumbnails depending on your device memory, while saving stays fast.',
      },
    ],
  },
  {
    id: 'delete-pdf-pages',
    slug: 'delete-pdf-pages',
    path: '/pdf-tools/delete-pdf-pages',
    name: 'Delete PDF Pages',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Click thumbnails or enter page ranges to remove unwanted pages from any PDF.',
    seoTitle: 'Delete PDF Pages Online Free – Remove Unwanted Pages | SmartGrow Tools',
    seoDescription:
      'Remove blank, outdated, or confidential pages from a PDF by clicking visual thumbnails or typing page numbers locally in your browser.',
    keywords: ['delete pdf pages', 'remove pages from pdf', 'trim pdf'],
    howItWorks: [
      'Upload your PDF to view visual page thumbnails and total page count.',
      'Click any pages you want removed (or type page numbers like 2, 5-7 to mark them quickly).',
      'Click Delete Selected Pages to download a clean PDF containing only the kept pages.',
    ],
    bestPractices: [
      'Toggle a range like 1, 10-12 when trimming cover sheets or blank appendix pages.',
      'Ensure at least one page remains in the document before exporting.',
      'Inspect thumbnail previews closely before deleting so multi-page tables stay intact.',
    ],
    faqs: [
      {
        question: 'Does deleting pages overwrite my original PDF file?',
        answer:
          'No. Your original file on disk remains untouched; the tool generates a separate cleaned PDF file for download.',
      },
      {
        question: 'Can I delete both individual pages and page ranges together?',
        answer:
          'Yes. Enter comma-separated numbers and ranges such as 1, 4-6, 9 or click cards directly in the thumbnail grid.',
      },
      {
        question: 'Will links inside kept pages still work?',
        answer:
          'External web links remain intact. Internal page jumps pointing to deleted pages should be checked if your PDF relies heavily on bookmarks.',
      },
    ],
  },
  {
    id: 'extract-pdf-pages',
    slug: 'extract-pdf-pages',
    path: '/pdf-tools/extract-pdf-pages',
    name: 'Extract PDF Pages',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Pull specific pages from a PDF into a new document or separate files in a ZIP.',
    seoTitle: 'Extract PDF Pages Free – Save Selected Pages as PDF or ZIP | SmartGrow Tools',
    seoDescription:
      'Select and extract exact pages, odd/even sheets, or ranges from any PDF into one new PDF or individual files via ZIP locally.',
    keywords: ['extract pdf pages', 'save pdf pages', 'pull pages from pdf'],
    howItWorks: [
      'Upload a PDF file to load live page thumbnails.',
      'Click the pages you want to keep, use Odd/Even presets, or enter page ranges like 2-5, 8.',
      'Choose whether to save selected pages into one combined PDF or separate PDF files in a ZIP, then export.',
    ],
    bestPractices: [
      'Use the Odd Pages or Even Pages shortcuts when separating front and back scans from a single-sided feeder.',
      'Choose Single Combined PDF when pulling a multi-page report section to share with clients.',
      'Choose Separate Files (ZIP) when archiving individual certificates or pay stubs.',
    ],
    faqs: [
      {
        question: 'What is the difference between Split PDF and Extract PDF Pages?',
        answer:
          'Split PDF divides an entire document into sections or chunks, while Extract PDF Pages lets you pick specific pages visually and save either one new PDF or individual files.',
      },
      {
        question: 'Are extracted pages preserved at full original quality?',
        answer:
          'Yes. Pages are copied structurally without rasterization, retaining original fonts, crisp vectors, and image resolution.',
      },
      {
        question: 'Can I extract pages out of order?',
        answer:
          'If you need custom page ordering as well as extraction, use Organize PDF Pages for drag-free step ordering.',
      },
    ],
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    path: '/pdf-tools/rotate-pdf',
    name: 'Rotate PDF',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Permanently rotate all PDF pages or individual sheets 90°, 180°, or 270° with live preview.',
    seoTitle: 'Rotate PDF Pages Permanently Online Free | SmartGrow Tools',
    seoDescription:
      'Fix sideways or upside-down PDF scans by rotating individual pages or the entire document 90, 180, or 270 degrees in your browser.',
    keywords: ['rotate pdf', 'fix upside down pdf', 'turn pdf pages'],
    howItWorks: [
      'Upload your PDF to view visual page thumbnails with current orientation.',
      'Click global controls to rotate all pages together, or rotate only specific pages 90° clockwise, counter-clockwise, or 180°.',
      'Click Save Rotated PDF to lock the orientation permanently into the exported file.',
    ],
    bestPractices: [
      'Rotate only the sideways chart or scanned receipt pages instead of turning portrait text pages sideways.',
      'Check portrait vs. landscape preview cards before saving so headers face upright.',
      'Pair rotated scans with Add PDF Page Numbers if assembling a final packet.',
    ],
    faqs: [
      {
        question: 'Does Rotate PDF save the rotation permanently?',
        answer:
          'Yes. Unlike temporary viewer rotation, this writes the updated PDF page rotation angle directly into the saved file.',
      },
      {
        question: 'Can I rotate just one or two pages inside a large PDF?',
        answer:
          'Yes. Each page card in the thumbnail view has its own rotate buttons alongside global all-page buttons.',
      },
      {
        question: 'Does rotating pages blur text or images?',
        answer:
          'No. Rotation adjusts the PDF page transform angle cleanly without re-encoding or degrading page quality.',
      },
    ],
  },
  {
    id: 'add-pdf-page-numbers',
    slug: 'add-pdf-page-numbers',
    path: '/pdf-tools/add-pdf-page-numbers',
    name: 'Add PDF Page Numbers',
    categoryId: 'organize-pdf',
    categoryName: 'Organize PDF',
    shortDescription:
      'Stamp customizable page numbers onto PDF pages with position, format, and cover skip options.',
    seoTitle: 'Add Page Numbers to PDF Online Free | SmartGrow Tools',
    seoDescription:
      'Insert clean page numbers onto PDF documents with custom corner/center placement, formatting, starting number, and cover-page skipping.',
    keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf footer numbering'],
    howItWorks: [
      'Upload your PDF document to inspect page dimensions and count.',
      'Choose corner or center placement, number format (1, 1 / N, or Page 1 of N), starting number, font size, and whether to skip the cover page.',
      'Preview placement cleanly and click Apply Page Numbers to download your numbered PDF.',
    ],
    bestPractices: [
      'Enable Skip First Page when numbering formal reports, portfolios, or ebooks with a designed title cover.',
      'Leave at least 24–36pt margin from page edges so printed documents do not clip page numbers.',
      'Use Page 1 of N format on legal exhibits or multi-part handouts so recipients know if pages are missing.',
    ],
    faqs: [
      {
        question: 'Can I skip the cover page and start numbering on page 2 as Page 1?',
        answer:
          'Yes. Enable Skip First Page and set Starting Number to 1 so the second sheet displays 1 while the cover remains unnumbered.',
      },
      {
        question: 'Can I choose header or footer placement?',
        answer:
          'Yes. You can stamp numbers at Top Left, Top Center, Top Right, Bottom Left, Bottom Center, or Bottom Right.',
      },
      {
        question: 'What font styles are available?',
        answer:
          'Standard PDF vector fonts (Helvetica, Times Roman, and Courier) keep numbers sharp at any zoom level with virtually zero added file size.',
      },
    ],
  },

  // 2. OPTIMIZE PDF (2 tools)
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    path: '/pdf-tools/compress-pdf',
    name: 'Compress PDF',
    categoryId: 'optimize-pdf',
    categoryName: 'Optimize PDF',
    shortDescription:
      'Shrink PDF file size using lossless object packing or balanced image downsampling.',
    seoTitle: 'Compress PDF Size Online Free – Browser PDF Optimizer | SmartGrow Tools',
    seoDescription:
      'Reduce PDF file size locally in your browser with lossless structural optimization or high-savings image compression and size comparison.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf optimizer'],
    howItWorks: [
      'Upload the PDF file you want to optimize and view its original byte size.',
      'Choose Lossless Structural Optimization (keeps crisp selectable text) or Balanced / Maximum Image Compression (renders and recompresses heavy image scans).',
      'Click Compress PDF to view exact file size savings and download the smaller document.',
    ],
    bestPractices: [
      'Try Lossless Structural Optimization first for text-heavy exports or PDFs bloated by editing history.',
      'Choose Balanced Compression when shrinking multi-megabyte scanned forms, slide decks, or photo-heavy brochures.',
      'Verify readability on one output page before deleting your original high-res archive.',
    ],
    limitationNote:
      'Balanced and Maximum compression rasterize pages at reduced DPI and JPEG quality to shrink large scanned or image-heavy PDFs, which converts selectable text on compressed pages into images. Lossless mode keeps vector text intact but typically achieves modest reductions on already-optimized PDFs.',
    faqs: [
      {
        question: 'Why does Lossless mode sometimes save only a small percentage?',
        answer:
          'If a PDF already uses compressed object streams and tightly packed fonts, removing structural overhead saves 5–15%. Heavy size drops on scanned documents require Balanced or Maximum image downsampling.',
      },
      {
        question: 'Does Balanced compression keep text selectable?',
        answer:
          'No. Browser-side image downsampling converts each page into an optimized JPEG image layer inside the PDF. Use Lossless mode whenever preserving selectable text is essential.',
      },
      {
        question: 'What if the compressed file turns out larger than a tiny original?',
        answer:
          'The results panel shows exact original vs. output sizes so you can immediately switch modes or keep your original if it is already maximally compact.',
      },
    ],
  },
  {
    id: 'repair-pdf',
    slug: 'repair-pdf',
    path: '/pdf-tools/repair-pdf',
    name: 'Repair PDF',
    categoryId: 'optimize-pdf',
    categoryName: 'Optimize PDF',
    shortDescription:
      'Attempt local structural recovery and cross-reference rebuilding on damaged PDFs.',
    seoTitle: 'Repair Corrupted PDF Online Free – Local Recovery | SmartGrow Tools',
    seoDescription:
      'Attempt to fix broken cross-reference tables, unreadable headers, or malformed PDF syntax locally in your browser without uploading files.',
    keywords: ['repair pdf', 'fix corrupted pdf', 'recover damaged pdf'],
    howItWorks: [
      'Upload the malformed or damaged PDF file experiencing viewer errors.',
      'Click Attempt PDF Repair to run two-stage recovery: structural cross-reference rebuilding via pdf-lib, with tolerant PDF.js page stream salvage as fallback.',
      'Inspect the recovery log showing salvaged pages and download the rebuilt PDF if recovery succeeds.',
    ],
    bestPractices: [
      'Keep an untouched copy of the damaged file before trying any recovery tool.',
      'If structural mode cannot open an old scan, allow the visual stream salvage fallback to rescue renderable pages.',
      'Re-test the repaired PDF in a second reader or browser tab to confirm compatibility.',
    ],
    limitationNote:
      'Browser-based PDF repair can rebuild broken cross-reference (xref) tables, trailing bytes, and salvage readable page streams. Severely truncated files missing core catalog dictionaries, zeroed binary payloads, or hardware-corrupted compression streams cannot be reconstructed by any client-side parser.',
    faqs: [
      {
        question: 'What types of PDF corruption can a browser tool fix?',
        answer:
          'Common structural errors such as broken xref tables, missing EOF markers, bad object offsets, or minor syntax glitches from incomplete downloads can often be rebuilt cleanly.',
      },
      {
        question: 'What happens if structural parsing fails completely?',
        answer:
          'If pdf-lib cannot open the PDF tree, the tool automatically attempts tolerant stream parsing via PDF.js to render recoverable pages into a clean new PDF.',
      },
      {
        question: 'Can this tool repair password-locked files without a password?',
        answer:
          'No. Encrypted PDFs require the valid password in Unlock PDF first; repair tools cannot bypass strong PDF encryption.',
      },
    ],
  },

  // 3. CONVERT PDF (6 tools)
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    path: '/pdf-tools/pdf-to-jpg',
    name: 'PDF to JPG',
    categoryId: 'convert-pdf',
    categoryName: 'Convert PDF',
    shortDescription:
      'Convert PDF pages into high-resolution JPG images with DPI scale and quality controls.',
    seoTitle: 'PDF to JPG Converter Free – High-Resolution Browser Export | SmartGrow Tools',
    seoDescription:
      'Convert PDF pages to sharp JPG images locally in your browser with adjustable resolution, JPEG quality, previews, and ZIP download.',
    keywords: ['pdf to jpg', 'convert pdf to jpeg', 'pdf page to image'],
    howItWorks: [
      'Upload a PDF document from your computer or phone.',
      'Select rendering scale (1x Screen, 2x Sharp Print, or 3x High-Res) and JPEG quality percentage.',
      'Click Convert to JPG to render previews and download individual pages or all images in one ZIP file.',
    ],
    bestPractices: [
      'Use 2x (144 DPI) for crisp slide thumbnails, presentations, and blog graphics without excessive file size.',
      'Choose 1x (72 DPI) when you only need lightweight web thumbnails.',
      'Switch to PDF to PNG if your pages contain sharp diagrams or fine UI screenshots.',
    ],
    faqs: [
      {
        question: 'Can I download just one specific page as JPG instead of all pages?',
        answer:
          'Yes. After conversion completes, every page card has its own Download JPG button alongside the Download All (ZIP) button.',
      },
      {
        question: 'Which DPI scale should I pick?',
        answer:
          '2x (144 DPI) balances sharp text readability and fast processing for most documents, while 3x (216 DPI) works best for detailed prints.',
      },
      {
        question: 'Are transparency layers supported in JPG?',
        answer:
          'JPG files always flatten onto a clean white page background. Use PDF to PNG if you need lossless graphics or optional transparent backgrounds.',
      },
    ],
  },
  {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    path: '/pdf-tools/pdf-to-png',
    name: 'PDF to PNG',
    categoryId: 'convert-pdf',
    categoryName: 'Convert PDF',
    shortDescription:
      'Render PDF pages as crisp, lossless PNG images individually or bundled in a ZIP.',
    seoTitle: 'PDF to PNG Converter Free – Lossless Page Images | SmartGrow Tools',
    seoDescription:
      'Turn PDF pages into lossless PNG images with sharp text, optional transparent background, and one-click ZIP export in your browser.',
    keywords: ['pdf to png', 'export pdf as png', 'lossless pdf image'],
    howItWorks: [
      'Drop or choose a PDF document to inspect its pages.',
      'Select output scale (1x, 2x, or 3x) and whether to preserve transparent backgrounds where supported.',
      'Click Convert to PNG to generate crisp previews and download individual files or a ZIP archive.',
    ],
    bestPractices: [
      'Use PNG instead of JPG when exporting charts, diagrams, CAD sketches, or sharp typography.',
      'Keep Scale at 2x for sharp retina web graphics with manageable file sizes.',
      'Download the ZIP archive when converting multi-page handbooks or slide decks.',
    ],
    faqs: [
      {
        question: 'When should I pick PDF to PNG over PDF to JPG?',
        answer:
          'Choose PNG for sharp text, vector diagrams, logos, and screenshots where JPEG compression artifacts would blur crisp edges.',
      },
      {
        question: 'Does Transparent Background work on every PDF?',
        answer:
          'If a PDF explicitly draws a solid white background rectangle across the page, that opaque layer stays white; otherwise unprinted paper areas export transparent.',
      },
      {
        question: 'Are all pages processed privately on my device?',
        answer:
          'Yes. Every page renders on local browser canvases using PDF.js and packages into a ZIP locally via JSZip.',
      },
    ],
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    path: '/pdf-tools/jpg-to-pdf',
    name: 'JPG to PDF',
    categoryId: 'convert-pdf',
    categoryName: 'Convert PDF',
    shortDescription:
      'Combine one or multiple JPG/JPEG photos into a clean, sized PDF document.',
    seoTitle: 'JPG to PDF Converter Free – Combine Images to PDF | SmartGrow Tools',
    seoDescription:
      'Convert JPG photos into a single PDF locally in your browser with drag-free image ordering, A4/Letter sizing, and custom page margins.',
    keywords: ['jpg to pdf', 'jpeg to pdf', 'images to pdf', 'photos to pdf'],
    howItWorks: [
      'Select one or more JPG/JPEG images and arrange them in your desired page order.',
      'Pick page dimensions (Fit to Image, A4, or US Letter), orientation, and page margin.',
      'Click Create PDF to embed your JPEG images directly without lossy re-encoding and download.',
    ],
    bestPractices: [
      'Choose Fit to Image when combining scanned receipts or varied camera dimensions with zero white borders.',
      'Choose A4 or US Letter with Auto orientation for clean printable packets and standardized document sharing.',
      'Order images sequentially before generating so multi-page photo scans read naturally.',
    ],
    faqs: [
      {
        question: 'Does JPG to PDF re-compress or blur my photos?',
        answer:
          'No. pdf-lib embeds valid JPEG image streams directly into the PDF container, preserving original pixel quality.',
      },
      {
        question: 'Can I mix portrait and landscape photos in one PDF?',
        answer:
          'Yes. Selecting Auto Orientation rotates A4 or Letter page dimensions per image so wide landscape photos are never squeezed.',
      },
      {
        question: 'What happens if I upload a PNG or WebP renamed as .jpg?',
        answer:
          'If a file is actually another image format, the converter safely normalizes it via an offscreen canvas so embedding never fails.',
      },
    ],
  },
  {
    id: 'png-to-pdf',
    slug: 'png-to-pdf',
    path: '/pdf-tools/png-to-pdf',
    name: 'PNG to PDF',
    categoryId: 'convert-pdf',
    categoryName: 'Convert PDF',
    shortDescription:
      'Turn one or multiple PNG graphics or screenshots into a crisp multi-page PDF.',
    seoTitle: 'PNG to PDF Converter Free – Combine PNGs Locally | SmartGrow Tools',
    seoDescription:
      'Convert single or multiple PNG screenshots and graphics into a cleanly sized PDF document in your browser with zero uploads.',
    keywords: ['png to pdf', 'combine png into pdf', 'screenshot to pdf'],
    howItWorks: [
      'Upload one or more PNG files and adjust their page sequence.',
      'Select Fit to Image, A4, or Letter paper sizing along with orientation and padding margin.',
      'Click Create PDF to embed lossless PNG images and download your finished PDF.',
    ],
    bestPractices: [
      'Use Fit to Image for high-resolution UI mockups or wide architectural exports.',
      'Add a Small or Standard margin when printing screenshots on office laser printers.',
      'Check file order before clicking Create PDF to keep multi-step tutorials sequential.',
    ],
    faqs: [
      {
        question: 'Are PNG transparency channels supported?',
        answer:
          'Yes. pdf-lib embeds PNG alpha channels cleanly onto the PDF page background.',
      },
      {
        question: 'How many PNG images can I combine into one PDF?',
        answer:
          'You can add dozens of PNGs in one session, limited only by your browser tab memory.',
      },
      {
        question: 'Can I convert the generated PDF back to single pages later?',
        answer:
          'Yes—any generated PDF works seamlessly with Split PDF, Compress PDF, or Organize PDF Pages.',
      },
    ],
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    path: '/pdf-tools/pdf-to-word',
    name: 'PDF to Word (DOCX)',
    categoryId: 'convert-pdf',
    categoryName: 'Convert PDF',
    shortDescription:
      'Extract headings, paragraphs, and page text from text-based PDFs into an editable DOCX file.',
    seoTitle: 'PDF to Word (DOCX) Converter Free – Browser Export | SmartGrow Tools',
    seoDescription:
      'Convert text-based PDF files into editable Microsoft Word (.docx) documents locally in your browser without uploading private files.',
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf to editable word'],
    howItWorks: [
      'Upload a text-based PDF document to extract text lines, font sizes, and paragraph boundaries.',
      'Inspect the structured text preview organized into headings and paragraphs per page.',
      'Click Download DOCX to generate a real Word (.docx) file locally in your browser.',
    ],
    bestPractices: [
      'Use this tool for digital text-based PDFs such as reports, essays, contracts, and resumes.',
      'If the preview reports zero selectable text (a scanned PDF), run OCR PDF first to extract readable text.',
      'Review tables or multi-column sidebars in Word after exporting since PDF coordinates differ from flowing Word styles.',
    ],
    limitationNote:
      'Browser-based PDF to Word reconstructs editable headings, paragraphs, and page breaks from selectable PDF text layers. Intricate multi-column magazine layouts, floating shapes, vector charts, and complex styled tables simplify into linear paragraphs rather than pixel-exact clones, and scanned image-only PDFs must run through OCR PDF first.',
    faqs: [
      {
        question: 'Why did my scanned PDF produce little or no text in PDF to Word?',
        answer:
          'Scanned PDFs store flat pictures of pages rather than digital characters. Use our OCR PDF tool first to recognize the text from the scanned images.',
      },
      {
        question: 'Does the exported file open in Microsoft Word and Google Docs?',
        answer:
          'Yes. It builds a standard OpenXML .docx package using the open-source docx library, compatible with Word, Google Docs, and LibreOffice.',
      },
      {
        question: 'Will multi-column tables look identical to the PDF?',
        answer:
          'Pure browser conversion focuses on clean, editable text paragraphs and headings. Complex nested tables and custom visual graphics generally require manual re-formatting inside Word.',
      },
    ],
  },
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    path: '/pdf-tools/word-to-pdf',
    name: 'Word to PDF',
    categoryId: 'convert-pdf',
    categoryName: 'Convert PDF',
    shortDescription:
      'Convert modern Word (.docx) documents into cleanly paginated PDF files locally.',
    seoTitle: 'Word to PDF (DOCX to PDF) Free Online Converter | SmartGrow Tools',
    seoDescription:
      'Turn .docx Word documents into paginated A4 or US Letter PDFs directly in your browser with zero server uploads.',
    keywords: ['word to pdf', 'docx to pdf', 'convert docx to pdf free'],
    howItWorks: [
      'Select or drop a modern Microsoft Word (.docx) file.',
      'Preview the parsed document structure (headings, bold/italic formatting, bullet lists, and tables) and pick A4 or Letter size.',
      'Click Convert Word to PDF to paginate and download your finished PDF.',
    ],
    bestPractices: [
      'Save older .doc files as modern .docx before converting—binary .doc format is not supported by pure browser parsers.',
      'Choose US Letter for North American printing or A4 for international standard page layouts.',
      'Check the generated preview count to verify long headings and lists wrap cleanly across page margins.',
    ],
    limitationNote:
      'Browser-based Word to PDF converts modern .docx files (via Mammoth) into cleanly formatted headings, paragraphs, bold/italic styles, lists, and simple tables rendered onto crisp paginated PDF sheets. Legacy binary .doc files, embedded Word macros, custom desktop fonts, and floating SmartArt graphics are not supported natively in client-side JavaScript.',
    faqs: [
      {
        question: 'Why are .docx files supported instead of older .doc files?',
        answer:
          '.docx is an open XML ZIP standard that modern browsers can unpack securely in JavaScript, whereas legacy .doc is a proprietary binary format requiring desktop office software.',
      },
      {
        question: 'Does Word to PDF preserve headings, bold text, and bullet lists?',
        answer:
          'Yes. Heading levels, bold and italic runs, bullet/numbered lists, and basic table grids are preserved cleanly across paginated pages.',
      },
      {
        question: 'Are special Unicode characters supported?',
        answer:
          'Yes. Because browser-rendered typography draws directly from your system fonts onto crisp high-DPI page canvases before packing into PDF, accented letters and non-Latin scripts render accurately.',
      },
    ],
  },

  // 4. EDIT PDF (5 tools)
  {
    id: 'add-text-to-pdf',
    slug: 'add-text-to-pdf',
    path: '/pdf-tools/add-text-to-pdf',
    name: 'Add Text to PDF',
    categoryId: 'edit-pdf',
    categoryName: 'Edit PDF',
    shortDescription:
      'Click anywhere on a PDF page preview to place custom text annotations, dates, or labels.',
    seoTitle: 'Add Text to PDF Online Free – Interactive Browser Editor | SmartGrow Tools',
    seoDescription:
      'Place custom text boxes, dates, or form fills anywhere on your PDF pages with live click-to-position preview in your browser.',
    keywords: ['add text to pdf', 'write on pdf', 'fill pdf text free'],
    howItWorks: [
      'Upload your PDF to display an interactive preview of any page.',
      'Enter your text, choose font family, size, color, and click anywhere on the page preview to place it (add as many text labels as needed).',
      'Click Apply Text & Download to embed crisp vector text directly into the PDF.',
    ],
    bestPractices: [
      'Use page navigation buttons above the preview to place annotations on multiple pages before exporting once.',
      'Match font size (usually 10–12pt) to surrounding form text for seamless form filling.',
      'Use Add Images to PDF or Sign PDF afterward if you also need a signature or stamp.',
    ],
    faqs: [
      {
        question: 'Can I add multiple text items across different pages before saving?',
        answer:
          'Yes. Every added text item lists its page number, text, and position so you can manage multiple annotations across the document and export once.',
      },
      {
        question: 'Can I edit existing paragraphs embedded inside the original PDF?',
        answer:
          'Add Text to PDF overlays new vector text cleanly on top of pages (ideal for filling forms, adding notes, or dates). To rewrite long prose, export via PDF to Word first.',
      },
      {
        question: 'Does placed text stay sharp when printed or zoomed?',
        answer:
          'Yes. Annotations are embedded as true vector PDF text rather than low-res bitmaps.',
      },
    ],
  },
  {
    id: 'add-images-to-pdf',
    slug: 'add-images-to-pdf',
    path: '/pdf-tools/add-images-to-pdf',
    name: 'Add Images to PDF',
    categoryId: 'edit-pdf',
    categoryName: 'Edit PDF',
    shortDescription:
      'Overlay PNG or JPG logos, stamps, QR codes, or photos onto any PDF page.',
    seoTitle: 'Add Images to PDF Online Free – Insert Logos & Stamps | SmartGrow Tools',
    seoDescription:
      'Insert PNG or JPG logos, stamps, or photos onto any PDF page with interactive click-to-place positioning and width/opacity controls.',
    keywords: ['add image to pdf', 'insert logo in pdf', 'stamp image on pdf'],
    howItWorks: [
      'Upload your target PDF and select the PNG or JPG image you want to place.',
      'Click on the interactive page preview to position the image, then adjust width scale and opacity.',
      'Click Embed Image & Download to save the updated PDF locally.',
    ],
    bestPractices: [
      'Upload transparent PNG logos when placing badges or company seals over existing borders.',
      'Adjust opacity between 70% and 100% for crisp stamps, or lower opacity for subtle corner graphics.',
      'Check visual proportions on the preview canvas before exporting.',
    ],
    faqs: [
      {
        question: 'Does Add Images to PDF support transparent PNGs?',
        answer:
          'Yes. PNG transparency is preserved cleanly so logos and stamps blend naturally onto colored or white PDF backgrounds.',
      },
      {
        question: 'Can I apply an image to just one page or multiple pages?',
        answer:
          'Select any page in the preview to place your image, or toggle Apply to All Pages when adding a repeating header logo.',
      },
      {
        question: 'Are embedded images kept high resolution?',
        answer:
          'Yes. Original PNG and JPEG bytes are embedded directly into the PDF without downgrading resolution.',
      },
    ],
  },
  {
    id: 'add-watermark',
    slug: 'add-watermark',
    path: '/pdf-tools/add-watermark',
    name: 'Add Watermark',
    categoryId: 'edit-pdf',
    categoryName: 'Edit PDF',
    shortDescription:
      'Stamp diagonal text watermarks or transparent image watermarks across PDF pages.',
    seoTitle: 'Add Watermark to PDF Free – Text or Logo Watermarks | SmartGrow Tools',
    seoDescription:
      'Stamp customizable diagonal text watermarks (such as DRAFT or CONFIDENTIAL) or transparent PNG logos onto PDF pages locally.',
    keywords: ['add watermark to pdf', 'pdf watermark', 'confidential stamp pdf'],
    howItWorks: [
      'Upload your PDF document and choose Text Watermark or Image Watermark.',
      'Customize watermark wording or logo, opacity, size, color, layout (Center Diagonal, Center Horizontal, or Tiled Pattern), and page target.',
      'Click Apply Watermark to stamp selected pages and download your marked PDF.',
    ],
    bestPractices: [
      'Keep opacity around 15%–30% so underlying document text remains easy to read.',
      'Use Tiled Grid mode on confidential drafts to deter simple edge cropping.',
      'Combine with Protect PDF permissions if you want to restrict casual edits.',
    ],
    faqs: [
      {
        question: 'Can I use both diagonal center watermarks and repeating tiled watermarks?',
        answer:
          'Yes. Switch between Center Diagonal (-45°), Center Horizontal, and Tiled Pattern to match how visible you want the mark to be.',
      },
      {
        question: 'Can I watermark only the first page or all pages?',
        answer:
          'Yes. Target All Pages, First Page Only, or a custom page range like 1-5.',
      },
      {
        question: 'Can I use a transparent company PNG logo as a watermark?',
        answer:
          'Yes. Switch to Image Watermark mode, upload a PNG or JPG logo, and set opacity and scale cleanly.',
      },
    ],
  },
  {
    id: 'sign-pdf',
    slug: 'sign-pdf',
    path: '/pdf-tools/sign-pdf',
    name: 'Sign PDF',
    categoryId: 'edit-pdf',
    categoryName: 'Edit PDF',
    shortDescription:
      'Draw, type, or upload a signature and place it visually onto any PDF page.',
    seoTitle: 'Sign PDF Online Free – Draw, Type or Upload Signature | SmartGrow Tools',
    seoDescription:
      'Sign PDF documents locally in your browser by drawing on a signature pad, typing a styled signature, or uploading a transparent PNG.',
    keywords: ['sign pdf', 'electronic signature pdf', 'fill and sign pdf free'],
    howItWorks: [
      'Upload the PDF document that needs your signature.',
      'Create your signature by drawing on the smooth canvas pad, typing your name in cursive style, or uploading a PNG/JPG signature image.',
      'Click the exact signature line on the PDF page preview, adjust signature width, and click Sign & Download PDF.',
    ],
    bestPractices: [
      'Use dark ink (black or navy blue) for clean printing and professional contract readability.',
      'Combine Sign PDF with Add Text to PDF if you also need to type your printed name, title, or date beside the signature.',
      'Note that visual electronic signatures are convenient for everyday forms; legally regulated cryptographic X.509 digital certificates require dedicated PKI signing software.',
    ],
    faqs: [
      {
        question: 'Is my drawn signature saved on any server?',
        answer:
          'No. Both your signature canvas and your PDF stay strictly in local browser memory and are cleared when you close or reset the page.',
      },
      {
        question: 'Can I resize the signature after clicking on the page preview?',
        answer:
          'Yes. Adjust the Signature Width slider while previewing the live overlay before exporting the final signed PDF.',
      },
      {
        question: 'What is the difference between this visual signature and a cryptographic digital ID?',
        answer:
          'This tool places a crisp transparent signature image onto PDF pages (standard visual e-signing). Cryptographic PKI certificates issued by certificate authorities require specialized desktop certificate hardware or services.',
      },
    ],
  },
  {
    id: 'crop-pdf',
    slug: 'crop-pdf',
    path: '/pdf-tools/crop-pdf',
    name: 'Crop PDF',
    categoryId: 'edit-pdf',
    categoryName: 'Edit PDF',
    shortDescription:
      'Trim unwanted white margins or isolate regions visually on one or all PDF pages.',
    seoTitle: 'Crop PDF Pages Online Free – Visual Margin Trimmer | SmartGrow Tools',
    seoDescription:
      'Crop PDF margins visually in your browser with interactive top, right, bottom, and left trim controls applied to single or all pages.',
    keywords: ['crop pdf', 'trim pdf margins', 'cut pdf border'],
    howItWorks: [
      'Upload your PDF to render an interactive preview of the page.',
      'Drag the Top, Right, Bottom, and Left trim percentage sliders (or apply quick uniform margin presets) while watching the live crop outline.',
      'Choose Current Page or All Pages, then click Crop & Download PDF.',
    ],
    bestPractices: [
      'Browse to a dense text page before setting margins so tight crop lines never clip page numbers or footnotes.',
      'Apply uniform margins across all pages when preparing wide-border scans for smaller tablet readers.',
      'Keep at least a 2%–3% buffer around content if the PDF will be printed on physical paper.',
    ],
    faqs: [
      {
        question: 'Does Crop PDF blur text or images inside the remaining area?',
        answer:
          'No. Cropping updates the PDF CropBox and MediaBox boundaries cleanly without re-rendering or degrading vector text.',
      },
      {
        question: 'Can I crop just one page differently from the rest?',
        answer:
          'Yes. Toggle Apply to Current Page Only to trim a single outlier sheet without altering other pages.',
      },
      {
        question: 'Are cropped margins permanently hidden in PDF viewers?',
        answer:
          'Yes. Setting both MediaBox and CropBox ensures browsers, Acrobat, Preview, and mobile readers display only your chosen region.',
      },
    ],
  },

  // 5. PDF SECURITY (2 tools)
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    path: '/pdf-tools/protect-pdf',
    name: 'Protect PDF',
    categoryId: 'pdf-security',
    categoryName: 'PDF Security',
    shortDescription:
      'Lock a PDF with password encryption and optional printing/copying permission rules.',
    seoTitle: 'Protect PDF with Password Free – Browser Encryption | SmartGrow Tools',
    seoDescription:
      'Encrypt PDF documents with strong AES-256 or AES-128 password protection and permission limits locally in your browser.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf free'],
    howItWorks: [
      'Upload the PDF file you want to encrypt.',
      'Enter a strong open password, pick encryption strength (AES-256 standard or AES-128 for legacy compatibility), and configure print/copy permissions.',
      'Click Encrypt & Download PDF to lock the file locally.',
    ],
    bestPractices: [
      'Store your password safely in a password manager—there is no password recovery backdoor.',
      'Choose AES-256 for modern security across Chrome, Edge, Safari, Preview, and Acrobat, or AES-128 if recipients open files in older readers.',
      'Use unique passphrases combining letters, numbers, and symbols for sensitive records.',
    ],
    faqs: [
      {
        question: 'Is my password or PDF sent over the internet when encrypting?',
        answer:
          'Never. Both encryption key derivation and PDF sealing happen locally inside your browser tab.',
      },
      {
        question: 'What is the difference between AES-256 and AES-128?',
        answer:
          'AES-256 follows the modern PDF 1.7 Ext 8 / PDF 2.0 standard with stronger encryption, while AES-128 offers broad compatibility with legacy PDF viewers.',
      },
      {
        question: 'Can anyone bypass printing or copying restrictions without the password?',
        answer:
          'Setting a user open password encrypts the file contents completely so the PDF cannot even be opened or decrypted without the password.',
      },
    ],
  },
  {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    path: '/pdf-tools/unlock-pdf',
    name: 'Unlock PDF',
    categoryId: 'pdf-security',
    categoryName: 'PDF Security',
    shortDescription:
      'Remove password protection from an authorized PDF when you supply its valid password.',
    seoTitle: 'Unlock Password-Protected PDF Free (With Password) | SmartGrow Tools',
    seoDescription:
      'Remove open passwords and restrictions from your own PDF documents locally in your browser by entering the authorized password.',
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf'],
    howItWorks: [
      'Upload the encrypted PDF file you own or are authorized to access.',
      'Enter the valid PDF password required to decrypt the file.',
      'Click Unlock PDF to generate an unencrypted copy cleanly in your browser.',
    ],
    bestPractices: [
      'Use Unlock PDF only on documents for which you hold the rightful password.',
      'Double-check Caps Lock if an expected password reports an invalid credential error.',
      'Store unlocked copies in a secure folder if they contain personal statements or tax records.',
    ],
    limitationNote:
      'This tool only unlocks encrypted PDFs when you supply the valid authorized password; it does not crack, brute-force, or bypass unknown PDF passwords. If a document uses an unusual legacy or custom security handler, the tool offers an optional visual page-reconstruction fallback after verifying your password.',
    faqs: [
      {
        question: 'Can Unlock PDF remove a password if I forgot it?',
        answer:
          'No. Strong PDF encryption cannot be bypassed without the legitimate password. You must enter the valid user or owner password.',
      },
      {
        question: 'Does unlocking preserve vector text and original layout?',
        answer:
          'Yes. When standard encryption is decrypted directly via @cantoo/pdf-lib, every page, font, and vector element stays completely intact.',
      },
      {
        question: 'Is my password logged anywhere?',
        answer:
          'No. Password verification and decryption occur strictly inside local browser memory.',
      },
    ],
  },

  // 6. PDF INTELLIGENCE (3 tools)
  {
    id: 'ocr-pdf',
    slug: 'ocr-pdf',
    path: '/pdf-tools/ocr-pdf',
    name: 'OCR PDF',
    categoryId: 'pdf-intelligence',
    categoryName: 'PDF Intelligence',
    shortDescription:
      'Recognize text inside scanned PDFs locally and export plain text or a searchable PDF.',
    seoTitle: 'OCR PDF Online Free – Extract Text & Make Searchable PDF | SmartGrow Tools',
    seoDescription:
      'Run browser-based Tesseract OCR on scanned PDF documents to extract editable text and build searchable PDFs privately with zero uploads.',
    keywords: ['ocr pdf', 'searchable pdf', 'scan to text pdf', 'pdf optical character recognition'],
    howItWorks: [
      'Upload a scanned or image-based PDF and select the document language and optional page range.',
      'Click Run Browser OCR; PDF.js renders crisp pages and Tesseract.js reads text locally inside Web Workers.',
      'Copy or download the recognized text (.txt), or download a Searchable PDF with an invisible selectable text layer embedded.',
    ],
    bestPractices: [
      'Process specific page ranges (such as 1-5) on very long scans for faster results.',
      'Ensure skewed or upside-down scans are rotated upright first with Rotate PDF—OCR accuracy improves dramatically on horizontal lines.',
      'Proofread specialized numbers, invoices, or handwriting since OCR accuracy depends on scan DPI and contrast.',
    ],
    limitationNote:
      'OCR runs 100% locally via Tesseract.js Web Workers and fetches open-source trained language data (~4–15 MB) directly into your browser cache on first run. Accuracy depends on scan clarity, font legibility, and page rotation; handwritten cursive scripts generally require manual review.',
    faqs: [
      {
        question: 'What is the difference between Extract Text and OCR PDF?',
        answer:
          'Extract Text reads existing digital text layers instantaneously. OCR PDF reads pixels from scanned pages or photos where no text layer exists yet.',
      },
      {
        question: 'Does Searchable PDF keep the original scanned appearance?',
        answer:
          'Yes. It places your crisp scanned page image visibly while positioning an invisible selectable/searchable text layer accurately underneath each recognized word.',
      },
      {
        question: 'Why does the first run take a few seconds before starting Page 1?',
        answer:
          'Your browser downloads and caches the free open-source Tesseract language model (~4–15 MB) locally so future OCR tasks run offline immediately.',
      },
    ],
  },
  {
    id: 'extract-text-from-pdf',
    slug: 'extract-text-from-pdf',
    path: '/pdf-tools/extract-text-from-pdf',
    name: 'Extract Text from PDF',
    categoryId: 'pdf-intelligence',
    categoryName: 'PDF Intelligence',
    shortDescription:
      'Pull clean, selectable text page-by-page from PDFs with search and TXT/MD export.',
    seoTitle: 'Extract Text from PDF Free – Copy & Download TXT | SmartGrow Tools',
    seoDescription:
      'Extract clean text from text-based PDFs page-by-page in your browser with word counts, search highlighting, and .txt or .md download.',
    keywords: ['extract text from pdf', 'pdf to text', 'copy text from pdf'],
    howItWorks: [
      'Upload a text-based PDF document to parse every page locally.',
      'Inspect extracted text with optional page dividers, word count summary, and quick search filter.',
      'Copy to clipboard or download the full extracted text as a .txt or .md file.',
    ],
    bestPractices: [
      'Toggle Include Page Separators on long research PDFs so citations stay tied to exact page numbers.',
      'If a document reports 0 words extracted, switch directly to OCR PDF because the file is image-only.',
      'Paste extracted drafts into Word Counter for readability and n-gram checks.',
    ],
    faqs: [
      {
        question: 'Why did a PDF return zero characters when extracting text?',
        answer:
          'Flat scanned PDFs or outlined vector graphics contain images instead of encoded character text. Use our OCR PDF tool to read text from scanned pages.',
      },
      {
        question: 'Does Extract Text preserve line breaks?',
        answer:
          'Yes. Text items are grouped by vertical Y-coordinates so lines and paragraphs read naturally instead of collapsing into one long string.',
      },
      {
        question: 'Can I download the text as Markdown?',
        answer:
          'Yes. Both plain .txt and clean Markdown (.md) downloads are included with one click.',
      },
    ],
  },
  {
    id: 'translate-pdf-text',
    slug: 'translate-pdf-text',
    path: '/pdf-tools/translate-pdf-text',
    name: 'Translate PDF Text',
    categoryId: 'pdf-intelligence',
    categoryName: 'PDF Intelligence',
    shortDescription:
      'Extract PDF text locally, run on-device browser translation when supported, and export bilingual drafts.',
    seoTitle: 'Translate PDF Text Locally – Private Browser Translation | SmartGrow Tools',
    seoDescription:
      'Extract PDF text locally, run on-device browser neural translation where supported (Chrome Translator API), or manage bilingual side-by-side drafts privately.',
    keywords: ['translate pdf text', 'browser pdf translator', 'bilingual pdf export'],
    howItWorks: [
      'Upload a text-based PDF to extract clean page segments locally without sending files to any server.',
      'Select source and target languages; if your browser provides on-device local translation (Chrome Translator API), run neural translation offline inside your browser.',
      'Review or edit segments side-by-side, apply custom terminology glossary replacements, and export a clean bilingual .txt or .docx draft.',
    ],
    bestPractices: [
      'Add key product names or technical terms into the Custom Glossary so repeated terms stay consistent.',
      'If your scanned PDF has no selectable text, extract text in OCR PDF first before translating.',
      'Export the bilingual side-by-side .docx when collaborating with human editors or reviewers.',
    ],
    limitationNote:
      'To protect privacy and avoid uploading your PDFs to external paid translation servers, automatic neural translation runs only when your browser supports local on-device translation (such as Chromium’s built-in Translator API). In browsers without on-device translation support, this tool still extracts every page cleanly, applies custom glossary/terminology rules, and lets you edit and export bilingual drafts locally.',
    faqs: [
      {
        question: 'Why does SmartGrow not send my PDF to an external translation server?',
        answer:
          'We process files strictly in your browser to keep private contracts, IDs, and drafts off third-party servers and avoid paid API keys.',
      },
      {
        question: 'Which browsers support automatic on-device PDF translation?',
        answer:
          'Modern Chromium-based desktop browsers implementing the built-in local Translator API can translate extracted segments directly on-device after downloading free local language packs.',
      },
      {
        question: 'What can I still do if my browser does not support built-in translation?',
        answer:
          'You can extract all pages cleanly, split long text into translation-ready chunks, apply custom glossary term replacements, edit translations side-by-side, and export a formatted .txt or .docx file.',
      },
    ],
  },
];

export function getPdfCategoryById(id: string): PdfCategoryMeta | undefined {
  return PDF_CATEGORIES.find((c) => c.id === id);
}

export function getPdfToolBySlug(slug: string): PdfToolDefinition | undefined {
  return PDF_TOOLS.find((t) => t.slug === slug);
}

export function getPdfToolsByCategory(categoryId: PdfCategoryId): PdfToolDefinition[] {
  return PDF_TOOLS.filter((t) => t.categoryId === categoryId);
}
