import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import formCustomizationTesterWorkflow from './FormCustomizationTester20260609.json';

export default function FormUiCustomizationPost() {
  const tocItems = [
    { id: 'hook-form-adoption', label: 'Form Adoption vs. Form Function' },
    { id: 'basics-body-customization', label: 'Form Body-Based Customization: The Basics' },
    { id: 'intermediate-layouts-tables', label: 'Intermediate Layouts, Spacing & Tables' },
    { id: 'advanced-css-polish', label: 'Advanced CSS, Visual Polish & Interactive Elements' },
    { id: 'showcase-layouts', label: 'Showcase: Advanced Layout Designs' },
    { id: 'title-customization', label: 'Form Title Customization' },
    { id: 'security-contrast-schema', label: 'Security, Contrast & Schema Guardrails' },
    { id: 'masterclass-dynamic-loops', label: 'Masterclass: Dynamic HTML Compilation' },
    { id: 'conclusion', label: 'Conclusion' }
  ];

  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 sticky top-32 hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
          
          <article className="lg:col-span-3 glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up min-w-0">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-6 font-bold uppercase tracking-widest">
              <a href="/" className="hover:text-cyan-400 transition-colors no-underline">Home</a>
              <span>/</span>
              <a href="/blog" className="hover:text-cyan-400 transition-colors no-underline">Blog</a>
              <span>/</span>
              <span className="text-slate-400">Form UI Customization</span>
            </nav>

            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracking-widest uppercase text-cyan-400">
                <span>Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>June 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Designing Beyond Default: <br />
                <span className="text-cyan-500 text-2xl md:text-3xl">(The Ultimate Guide to SailPoint Form UI Customization)</span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden p-[2px]">
                  <img src="/images/profile.jpg" alt="Tyler" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <p className="text-white">Tyler</p>
                  <p>IdentityEXE Founder</p>
                </div>
              </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-code:text-cyan-300 prose-code:bg-cyan-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
              
              {/* Hook: Form Adoption vs Form Function */}
              <h3 id="hook-form-adoption" className="text-2xl text-white mt-8 mb-4 font-black tracking-tight">Form Adoption vs. Form Function</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                As Identity Access Management (IAM) professionals, we spend weeks designing robust joiner-mover-leaver processes, automated workflows, and complex approvals. When it's time to roll them out to the business, we deploy them using out-of-the-box, plain-text forms. We tell ourselves that as long as the form is functional and the backend APIs provision access correctly, our job is done.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                But then the complaints roll in. Business managers find the forms confusing. End users request access for the wrong systems because the forms don't provide clear context. The business doesn't <em>want</em> to use our carefully crafted IAM portal—they tolerate it.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                What if you could design forms that users actually enjoy using? Forms that carry your organization’s branding, feature rich dashboard-style summaries, collapse technical logs behind interactive dropdowns, and dynamically format complex multi-system details?
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed font-semibold text-white">
                This blog post fixes the form adoption gap. We will walk you through the undocumented and underutilized capabilities of the SailPoint Identity Security Cloud (ISC) Forms engine—starting from basic HTML elements and progressing all the way to advanced layouts, custom Unicode title formatting, and dynamic variable compilation via serial workflow loops.
              </p>

              <hr className="border-white/10 my-10" />

              {/* Section 1: Basics */}
              <h3 id="basics-body-customization" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Form Body-Based Customization: The Basics</h3>
              <p className="text-slate-300 mb-6">
                When designing forms within SailPoint ISC, the section descriptions, field descriptions, and injected workflow variables are not restricted to plain text. The Form UI rendering engine features a robust Document Object Model (DOM) pipeline that parses standard HTML tags and basic inline CSS.
              </p>
              <p className="text-slate-300 mb-6">
                To see what you can edit out-of-the-box in the standard Forms designer interface:
              </p>

              {/* Image 1 */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/form-ui-customization/Example-Of-UI-Editing-Options.png" 
                      alt="Form UI Editing Options"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">Standard Forms Designer Editing Interface</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 mb-6">
                If you need to structure a standard request block or highlight a policy warning, you can use these core HTML elements natively in your form body configurations:
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. Typography & Structure Tags</h4>
              <ul className="space-y-4 text-slate-300 mb-8 list-none pl-0">
                <li>
                  <strong className="text-white"><code>&lt;div&gt;</code> (Block Container):</strong> Isolates custom styled text blocks.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<div style='background-color: gray; padding: 10px;'>This is text inside an isolated div block.</div>"}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;span&gt;</code> (Inline Wrapper):</strong> Applies inline styles to specific words without breaking the line flow.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"Text before the span <span style='color: blue;'>this text is inside an isolated span</span> text after."}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;p&gt;</code> (Paragraph):</strong> Groups text sentences with default spacing.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<p>This is paragraph number one.</p><p>This is paragraph number two.</p>"}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;br&gt;</code> (Line Break):</strong> Inserts a line break to split strings vertically.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"Line number one text.<br>Line number two text right below it."}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;hr&gt;</code> (Horizontal Rule):</strong> Draws a clean divider line to separate sections.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"Text above the line.\n<hr>\nText below the line."}</code></pre>
                  </div>
                </li>
              </ul>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">2. Text Formatting & Semantics</h4>
              <p className="text-slate-300 mb-4">
                You can call out important variables, system names, or policy warnings using standard inline semantic elements:
              </p>
              <ul className="space-y-4 text-slate-300 mb-8 list-none pl-0">
                <li>
                  <strong className="text-white"><code>&lt;strong&gt;</code> or <code>&lt;b&gt;</code> (Bold):</strong> Emphasizes critical words.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"This is standard text and <strong>this text should be strictly bolded</strong>."}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;em&gt;</code> or <code>&lt;i&gt;</code> (Italics):</strong> Denotes emphasis or subtext.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"This is standard text and <em>this text is italicized via emphasis</em>."}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;code&gt;</code> (Inline Code Block):</strong> Formats account identifiers, APIs, or configuration parameters in monospace text.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"The target account identifier is <code>xyz_employee_123</code>."}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;pre&gt;</code> (Preformatted Text):</strong> Preserves text formatting, including spaces and indentation, directly in the UI.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<pre>\nLine 1: Preserving spaces\nLine 2:    and indentation\nLine 3: exactly like this.\n</pre>"}</code></pre>
                  </div>
                </li>
              </ul>

              <hr className="border-white/10 my-10" />

              {/* Section 2: Intermediate */}
              <h3 id="intermediate-layouts-tables" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Intermediate Layouts, Spacing & Tables</h3>
              <p className="text-slate-300 mb-6">
                Forms often need to present lists of entitlements or tabular summaries of requested roles. Instead of relying on long, hard-to-read paragraphs, you can structure your forms using tables, bulleted lists, and inline CSS box alignment properties.
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. List Tags</h4>
              <ul className="space-y-4 text-slate-300 mb-8 list-none pl-0">
                <li>
                  <strong className="text-white"><code>&lt;ul&gt;</code> & <code>&lt;li&gt;</code> (Unordered List):</strong> Creates standard bulleted lists for summarizing requirements or roles.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<ul>\n  <li>First unordered item</li>\n  <li>Second unordered item</li>\n</ul>"}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>&lt;ol&gt;</code> & <code>&lt;li&gt;</code> (Ordered List):</strong> Creates numbered lists to guide users through multi-step instructions.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<ol>\n  <li>First numbered item</li>\n  <li>Second numbered item</li>\n</ol>"}</code></pre>
                  </div>
                </li>
              </ul>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">2. Tabular Data Tags</h4>
              <p className="text-slate-300 mb-4">
                To present clean attribute maps, use the standard <code>&lt;table&gt;</code> structure:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<table style='width: 100%; border-collapse: collapse;'>
  <tr style='background-color: #1a1a1a; color: white;'>
    <th style='padding: 6px; width: 30%; text-align: left;'>Permission</th>
    <th style='padding: 6px; width: 70%; text-align: left;'>Risk Level</th>
  </tr>
  <tr style='border-bottom: 1px solid #eee;'>
    <td style='padding: 6px;'>Domain Admin</td>
    <td style='padding: 6px; color: red; font-weight: bold;'>CRITICAL</td>
  </tr>
</table>`}</code></pre>
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">3. Inline CSS Layout Properties</h4>
              <p className="text-slate-300 mb-4">
                Modern layouts are built on Flexbox and CSS Grid. You can use these inline properties in your containers to structure elements side-by-side:
              </p>
              <ul className="space-y-4 text-slate-300 mb-8 list-none pl-0">
                <li>
                  <strong className="text-white"><code>display: flex;</code>:</strong> aligns elements horizontally or vertically.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<div style='display: flex;'><div style='padding: 5px;'>Left Item</div><div style='padding: 5px;'>Right Item</div></div>"}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>display: grid;</code>:</strong> creates complex multi-column grids.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<div style='display: grid; grid-template-columns: auto auto;'><div style='padding: 5px;'>Cell 1</div><div style='padding: 5px;'>Cell 2</div></div>"}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>justify-content: space-between;</code>:</strong> pushes items to opposite sides.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<div style='display: flex; justify-content: space-between;'><span>Left Aligned</span><span>Right Aligned</span></div>"}</code></pre>
                  </div>
                </li>
                <li>
                  <strong className="text-white"><code>align-items: center;</code>:</strong> centers items vertically.
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mt-2 border border-white/10">
                    <pre className="text-xs text-cyan-300 m-0"><code>{"<div style='display: flex; align-items: center; height: 50px;'><span>Vertically Centered Text</span></div>"}</code></pre>
                  </div>
                </li>
              </ul>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">4. CSS Box Model & Spacing</h4>
              <p className="text-slate-300 mb-4">
                Control the spacing and width of your custom widgets using properties like <code>padding</code>, <code>margin-bottom</code>, <code>width</code>, and <code>max-width</code> to prevent form fields from shifting:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='padding: 25px; margin-bottom: 30px; max-width: 500px; background-color: lightgray;'>
  Testing spacing, margins, and constrained max-width.
</div>`}</code></pre>
              </div>

              <hr className="border-white/10 my-10" />

              {/* Section 3: Advanced CSS */}
              <h3 id="advanced-css-polish" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Advanced CSS, Visual Polish & Interactive Elements</h3>
              <p className="text-slate-300 mb-6">
                If you want to take your forms from basic HTML layouts to premium, enterprise-grade dashboards, you can leverage advanced CSS techniques like border accents, box shadows, text rendering overrides, and native interactive components.
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. Borders, Backgrounds & Shadows</h4>
              <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
                <li><strong className="text-white"><code>border-left</code> (Left Accent Border):</strong> Perfect for making warnings or notices stand out.</li>
                <li><strong className="text-white"><code>border-radius</code>:</strong> Creates soft, modern curved borders.</li>
                <li><strong className="text-white"><code>box-shadow</code>:</strong> Adds visual depth and lift.</li>
              </ul>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #ddd; border-left: 5px solid #3498db; border-radius: 6px; padding: 15px; background-color: #fff;'>
  Testing elevated card shadow with left accent border.
</div>`}</code></pre>
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">2. Advanced Typography Overrides</h4>
              <ul className="space-y-3 text-slate-300 mb-6 list-disc pl-5">
                <li><strong className="text-white"><code>white-space: pre-wrap;</code>:</strong> Ensures long, multi-line logs preserve their line breaks and indentations natively without needing the bulky layout constraints of the <code>&lt;pre&gt;</code> tag.</li>
                <li><strong className="text-white"><code>word-break: break-all;</code>:</strong> Essential when displaying long Active Directory DNs (<code>CN=Tyler Rettkowski,OU=Consultants,OU=Glendale,DC=identityexe,DC=com</code>) or work emails, preventing them from overflowing and clipping the edges of the form container.</li>
                <li><strong className="text-white"><code>text-shadow</code>:</strong> Adds a subtle shadow behind titles to make them pop.</li>
                <li><strong className="text-white"><code>opacity</code> & <code>text-transform</code>:</strong> Modulates emphasis and casing.</li>
              </ul>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<span style='font-weight: bold; font-size: 16px; color: #2c3e50; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); text-transform: uppercase;'>
  Secured Lifecycle Operation Summary
</span>`}</code></pre>
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">3. Interactive Accordion Dropdowns (<code>&lt;details&gt;</code> & <code>&lt;summary&gt;</code>)</h4>
              <p className="text-slate-300 mb-4">
                When audit requirements demand that you display raw data logs or metadata on a form, displaying it all by default can clutter the user experience. You can use the native browser accordion to hide this data behind an interactive toggle:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<details style='cursor: pointer; background: #222; padding: 8px; border-radius: 4px; color: #fff;'>
  <summary style='font-weight: bold; color: #3498db;'>🔍 View Raw Identity Target Attributes</summary>
  <div style='margin-top: 8px; font-family: monospace; font-size: 11px; color: #00ff00; border-top: 1px solid #2d2d35; padding-top: 8px;'>
    costCenter: CC-9942<br>
    location: Phoenix-HQS<br>
    status: Pre-Hire
  </div>
</details>`}</code></pre>
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">4. Custom UI Component Examples</h4>
              <p className="text-slate-300 mb-4">
                By putting these elements together, you can build pre-styled components:
              </p>

              <h5 className="text-white font-bold mb-2">A. The Standard Info Alert Banner</h5>
              <p className="text-slate-300 mb-2">Mimics an official platform notification notice, ideal for displaying policy rules right above a form input:</p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='background-color: #e3f2fd; border: 1px solid #90caf9; border-left: 5px solid #2196f3; padding: 12px; border-radius: 4px; color: #0d47a1; font-size: 13px;'>
  <strong>ℹ️ Notice:</strong> Requesting privileged group access automatically routes this item to the Information Security oversight queue.
</div>`}</code></pre>
              </div>

              <h5 className="text-white font-bold mb-2">B. The Mini Identity Profile Badge</h5>
              <p className="text-slate-300 mb-2">A clean way to present multiple target attributes side by side:</p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='display: flex; gap: 8px;'>
  <span style='background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;'>👤 Status: Pre-Hire</span>
  <span style='background-color: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;'>🔑 Type: Contractor</span>
</div>`}</code></pre>
              </div>

              <h5 className="text-white font-bold mb-2">C. Clean Key Value Row Item</h5>
              <p className="text-slate-300 mb-2">Subtle summary rows that separate information cleanly:</p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='padding: 8px 0; border-bottom: 1px dashed #ccc; font-size: 13px;'>
  <span style='color: #666; font-weight: bold;'>Target System:</span> 
  <code style='float: right; color: #333;'>Active_Directory_Production</code>
</div>`}</code></pre>
              </div>

              <hr className="border-white/10 my-10" />

              {/* Section 4: Showcase */}
              <h3 id="showcase-layouts" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Showcase: Advanced Layout Designs (Complex Custom Dashboards)</h3>
              <p className="text-slate-300 mb-6">
                To show you just how far you can push this styling engine, let's look at three complex, enterprise-ready dashboard components. These widgets combine borders, flexbox grid spacing, custom table alignments, and color-coded status pills to convey high-density security parameters cleanly:
              </p>

              <h4 className="text-xl text-cyan-400 mt-8 mb-3">1. The High-Risk Access Escalation Summary</h4>
              <p className="text-slate-300 mb-4">
                This configuration builds a complete security warning block. It combines a bold status bar, side-by-side flex layout info boxes, a clean data table with custom cell widths, and an inline policy justification notice. It is a perfect mock-up for a Request Center step where an approver needs to see the exact blast radius of a critical permission assignment:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='background: #fff; border: 1px solid #d32f2f; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-width: 650px; font-family: sans-serif; overflow: hidden;'>
  <div style='background: #d32f2f; color: #fff; padding: 12px 16px; font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; align-items: center;'>
    <span>🚨 High-Risk Governance Override Detected</span>
    <span style='background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;'>SOD Violation</span>
  </div>
  <div style='padding: 16px;'>
    <p style='margin: 0 0 14px 0; font-size: 13px; color: #333; line-height: 1.5;'>The identity lifecycle modification requested requires administrative authorization due to an automatic policy match against the **Global Core Infrastructure Guardrail** matrix.</p>
    <div style='display: flex; gap: 12px; margin-bottom: 14px;'>
      <div style='flex: 1; background: #fafafa; border: 1px solid #e0e0e0; padding: 10px; border-radius: 4px;'>
        <span style='font-size: 11px; color: #666; text-transform: uppercase; font-weight: 600;'>Target Object</span><br>
        <code style='font-size: 12px; color: #1e88e5; font-weight: bold;'>AWS-Prod-IAM-Admin</code>
      </div>
      <div style='flex: 1; background: #fafafa; border: 1px solid #e0e0e0; padding: 10px; border-radius: 4px;'>
        <span style='font-size: 11px; color: #666; text-transform: uppercase; font-weight: 600;'>Risk Score Impact</span><br>
        <span style='font-size: 13px; color: #e53935; font-weight: bold;'>Critical (820 / 1000)</span>
      </div>
    </div>
    <table style='width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 14px;'>
      <tr style='background: #f5f5f5; border-bottom: 2px solid #e0e0e0; text-align: left;'>
        <th style='padding: 6px 8px; color: #555;'>Entitlement Context Attribute</th>
        <th style='padding: 6px 8px; color: #555;'>Assignment Rule Value</th>
      </tr>
      <tr style='border-bottom: 1px solid #eee;'>
        <td style='padding: 6px 8px; font-weight: bold; color: #333;'>Entitlement ID</td>
        <td style='padding: 6px 8px; font-family: monospace; color: #555;'>ent_991_aws_master_super</td>
      </tr>
      <tr style='border-bottom: 1px solid #eee;'>
        <td style='padding: 6px 8px; font-weight: bold; color: #333;'>Provisioning Path</td>
        <td style='padding: 6px 8px; color: #555;'>Direct Connected API (No Remediation Queue)</td>
      </tr>
    </table>
    <div style='background: #fff8e1; border: 1px solid #ffe082; border-left: 4px solid #ffb300; padding: 10px; border-radius: 4px; color: #b78103; font-size: 12px; line-height: 1.4;'>
      <strong>⚠️ Audit Notice:</strong> Proceeding with this operation logs a dynamic exception token to the corporate logging pipeline for the Q3 external system alignment review.
    </div>
  </div>
</div>`}</code></pre>
              </div>

              {/* Image 2 */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/form-ui-customization/Loop-Variable-Builder-Customized-Form-2.png" 
                      alt="High-Risk Governance Override Detected UI"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">High-Risk Access Escalation Summary Widget</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-cyan-400 mt-8 mb-3">2. The Comprehensive Identity Profile Dashboard Block</h4>
              <p className="text-slate-300 mb-4">
                This configuration completely redesigns the standard field display, arranging identity metadata into a clean, floating management console card. It builds a profile header, stacks metadata items horizontally via custom widths inside a flex row layout, and embeds a togglable <code>&lt;details&gt;</code> log summary directly inside the widget base:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='background: #1e1e24; color: #fff; border: 1px solid #2d2d35; border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,0.15); max-width: 650px; font-family: sans-serif; padding: 16px;'>
  <div style='display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2d2d35; padding-bottom: 12px; margin-bottom: 14px;'>
    <div>
      <span style='font-size: 16px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'>👤 Core Identity Context Card</span><br>
      <span style='font-size: 11px; color: #8a8a93;'>Data Source: Active HR Authority Sync</span>
    </div>
    <div style='background: #2e7d32; color: #fff; border: 1px solid #4caf50; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;'>Match Validated</div>
  </div>
  <div style='display: flex; gap: 10px; margin-bottom: 14px;'>
    <div style='width: 33%; background: #25252d; padding: 8px; border-radius: 4px; text-align: center;'>
      <span style='font-size: 10px; color: #8a8a93; text-transform: uppercase;'>Work Email</span><br>
      <span style='font-size: 11px; font-weight: bold; color: #3498db; word-break: break-all;'>t.rett@identityexe.com</span>
    </div>
    <div style='width: 33%; background: #25252d; padding: 8px; border-radius: 4px; text-align: center;'>
      <span style='font-size: 10px; color: #8a8a93; text-transform: uppercase;'>Cost Center</span><br>
      <code style='font-size: 11px; color: #e67e22; font-weight: bold;'>CC-AZ-PHX-991</code>
    </div>
    <div style='width: 34%; background: #25252d; padding: 8px; border-radius: 4px; text-align: center;'>
      <span style='font-size: 10px; color: #8a8a93; text-transform: uppercase;'>Management Anchor</span><br>
      <span style='font-size: 11px; font-weight: bold; color: #fff;'>Marcus Vance (VP)</span>
    </div>
  </div>
  <div style='white-space: pre-wrap; font-family: monospace; font-size: 12px; background: #151518; padding: 10px; border-radius: 4px; border: 1px solid #25252d; color: #aaa; margin-bottom: 14px;'>
    Target Directory BaseDN String Verification:\n\`CN=Tyler Rettkowski,OU=Consultants,OU=Glendale,DC=identityexe,DC=com\`
  </div>
  <details style='cursor: pointer; background: #25252d; padding: 8px; border-radius: 4px; border: 1px solid #2d2d35;'>
    <summary style='font-weight: bold; font-size: 12px; color: #3498db;'>🔍 View Active Multi-Tenant Operational Parameters</summary>
    <div style='margin-top: 10px; font-family: monospace; font-size: 11px; color: #2ecc71; border-top: 1px solid #2d2d35; padding-top: 8px;'>
      sailpointWorkgroupMembership: [Mgt-Override-Tier3, Sec-Ops-Approver]<br>
      identityLifecycleState: authorizedContractorExtension<br>
      associatedAccountsCount: 7 Source Connectors Linked
    </div>
  </details>
</div>`}</code></pre>
              </div>

              {/* Image 3 */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/form-ui-customization/Loop-Variable-Builder-Customized-Form-3.png" 
                      alt="Core Identity Context Card UI"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">Identity Context Dashboard Block</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-cyan-400 mt-8 mb-3">3. The Interactive Access Verification Checksheet</h4>
              <p className="text-slate-300 mb-4">
                This component models an inline compliance overview dashboard sheet. It leverages detailed status rows with border separation accents, floating status badges, and an accent informational callout box. This configuration shows off how text alignment, borders, and flex structures can generate enterprise-grade UI designs natively inside SailPoint descriptions:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-8 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`<div style='background: #fff; border: 1px solid #cfd8dc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); max-width: 650px; font-family: sans-serif; padding: 16px;'>
  <div style='font-size: 15px; font-weight: bold; color: #37474f; margin-bottom: 4px;'>📋 Pre-Provisioning Compliance Verification Checksheet</div>
  <p style='margin: 0 0 16px 0; font-size: 12px; color: #78909c;'>Verify downstream target platform state criteria prior to authorizing transaction execution.</p>
  <div style='padding: 10px 0; border-bottom: 1px dashed #cfd8dc; display: flex; justify-content: space-between; align-items: center; font-size: 13px;'>
    <span style='color: #455a64; font-weight: bold;'>1. Downstream Target Core System Connectivity State</span>
    <span style='background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;'>Online / Available</span>
  </div>
  <div style='padding: 10px 0; border-bottom: 1px dashed #cfd8dc; display: flex; justify-content: space-between; align-items: center; font-size: 13px;'>
    <span style='color: #455a64; font-weight: bold;'>2. Identity Correlated Account Link Check</span>
    <span style='background: #fff3e0; color: #e65100; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;'>Link Unmatched (Will Create)</span>
  </div>
  <div style='padding: 10px 0; border-bottom: 1px dashed #cfd8dc; display: flex; justify-content: space-between; align-items: center; font-size: 13px;'>
    <span style='color: #455a64; font-weight: bold;'>3. Licensing Availability Pool Threshold Validation</span>
    <span style='background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;'>Seats Allocated OK</span>
  </div>
  <div style='margin-top: 14px; background: #eceff1; padding: 10px; border-radius: 4px; border-left: 4px solid #607d8b; font-size: 12px; color: #37474f; line-height: 1.45;'>
    <strong>💡 Implementation Note:</strong> Downstream account correlation calculations will use the primary identity anchor matching formula on the next scheduled engine aggregation run cycle.
  </div>
</div>`}</code></pre>
              </div>

              {/* Image 4 */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/form-ui-customization/Loop-Variable-Builder-Customized-Form-4.png" 
                      alt="Pre-Provisioning Compliance Verification Checksheet UI"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">Compliance Verification Checksheet Block</span>
                  </div>
                </div>
              </div>

              <hr className="border-white/10 my-10" />

              {/* Section 5: Title Customization */}
              <h3 id="title-customization" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Form Title Customization (Unicode, Emojis & Pseudo-Fonts)</h3>
              <p className="text-slate-300 mb-6">
                While the form <em>body</em> is highly customizable via HTML and CSS, the form <em>title</em> is handled differently. The title is processed as a <strong className="text-white">strict plain-text text node</strong>.
              </p>
              <p className="text-slate-300 mb-6">
                If you attempt to inject tags like <code>&lt;span&gt;</code> or <code>&lt;strong&gt;</code> into a form title, they will either render literally (<code>&lt;span&gt;Title&lt;/span&gt;</code>) or be completely stripped by the cross-site scripting (XSS) sanitizer.
              </p>
              <p className="text-slate-300 mb-6">
                However, you can still customize form titles by bypassing the HTML renderer entirely and leveraging <strong className="text-white">Unicode glyphs, emojis, and mathematical alphanumeric pseudo-fonts</strong>.
              </p>
              <p className="text-slate-300 mb-6">
                Here are five highly effective production layout patterns that successfully customize the header:
              </p>

              <ol className="space-y-4 text-slate-300 mb-8 list-decimal pl-5">
                <li>
                  <strong className="text-white">The Multi-Segment Governance Breadcrumb:</strong><br />
                  Uses light geometric arrows and vertical pipe characters to separate context cleanly:<br />
                  <code className="text-xs">🌐 GOVERNANCE ┃ Account Provisioning Engine ➔ AD_Target_Console</code>
                </li>
                <li>
                  <strong className="text-white">The High-Contrast Security Callout Banner:</strong><br />
                  Utilizes double-line box margins and distinct status indicators to establish a hard visual boundary:<br />
                  <code className="text-xs">║ ⛔ SECURITY EXCEPTION ║ 𝖫𝖨𝖥𝖤𝖢𝖸𝖢𝖫𝖤_𝖲𝖳𝖳𝖤_𝖬𝖮𝖣𝖨𝖥𝖨𝖢𝖠𝖳𝖨𝖮𝖭</code>
                </li>
                <li>
                  <strong className="text-white">The Minimalist Technical Audit Header:</strong><br />
                  Combines thick vertical block accents with a faux-monospace font block:<br />
                  <code className="text-xs">▍ [AUDIT LOG SUMMARY] Identity Lifecycle Parameters : 𝖢𝖮𝖱𝖢_𝖧𝖱_𝖠𝖴𝖳𝖧𝖮𝖱𝖨𝖳𝖸</code>
                </li>
                <li>
                  <strong className="text-white">The Tokenized Action & Target Panel Header:</strong><br />
                  Structures text explicitly using mathematical bold characters and index dividers to mimic an app title bar:<br />
                  <code className="text-xs">📋 𝐃𝐚𝐬𝐡𝐛𝐨𝐚𝐫𝐝 𝐕𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧 𝐂𝐨𝐧𝐬𝐨𝐥𝐞 ▪ Target Object Reference Matrix ▪ [Active]</code>
                </li>
                <li>
                  <strong className="text-white">The Alert-Level Status Matrix Block:</strong><br />
                  Leverages heavy color warning blocks and explicit visual boundaries:<br />
                  <code className="text-xs">⚠️ 🟥 [CRITICAL OVERRIDE ALERT] 🟥 𝖦𝖫𝖮𝖡𝖠𝖫_𝖨𝖭𝖥𝖱𝖠_𝖦𝖴𝖠𝖱𝖣𝖱𝖠𝖨𝖫</code>
                </li>
              </ol>

              <div className="bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-xl mb-8">
                <h4 className="text-white font-bold text-base m-0">Technical Title Limitations</h4>
                <ul className="list-disc pl-5 mt-2 text-sm text-slate-300 space-y-1.5">
                  <li><strong>The "Broken Square" Fallback:</strong> Alphanumeric blocks (the math characters used to fake bold or sans-serif styling) rely on the client browser's Unicode rendering. On older operating systems or thin clients, these characters may render as empty boxes (<code>□</code>).</li>
                  <li><strong>Strict Truncation Boundaries:</strong> Form headers have a fixed width in the viewport. Long titles or heavy glyph sequences can easily get clipped, causing the UI to append an ellipsis (<code>...</code>) and hide critical text.</li>
                  <li><strong>No Layout Engine Support:</strong> Margins, padding, or flex alignment properties cannot be applied within titles. All layout must rely on native space characters.</li>
                </ul>
              </div>

              <hr className="border-white/10 my-10" />

              {/* Section 6: Security and contrast guardrails */}
              <h3 id="security-contrast-schema" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Security, Contrast & Schema Guardrails</h3>
              <p className="text-slate-300 mb-6">
                When pushing the limits of Form UI customization, you must stay within SailPoint's platform boundaries. Breaking these rules will result in either broken layouts or deployment errors.
              </p>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">1. Active Cross-Site Scripting (XSS) Sanitization</h4>
              <p className="text-slate-300 mb-4">
                SailPoint aggressively sanitizes interactive elements:
              </p>
              <ul className="space-y-2 text-slate-300 mb-6 list-disc pl-5">
                <li><strong className="text-white">Direct Script Tags:</strong> Any <code>&lt;script&gt;</code> tag will be stripped from the DOM.</li>
                <li><strong className="text-white">Event Handlers:</strong> Inline attributes like <code>onclick</code>, <code>onmouseover</code>, or other DOM event triggers are parsed and filtered out.</li>
                <li><strong className="text-white">Malicious URLs:</strong> Links utilizing <code>javascript:alert('XSS')</code> protocols are cleanly blocked.</li>
              </ul>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">2. Contrast Safety: Light vs. Dark Mode</h4>
              <p className="text-slate-300 mb-4">
                SailPoint ISC defaults to a dark gray font color inside native description blocks.
              </p>
              <div className="bg-red-950/30 border-l-4 border-red-500 p-4 rounded-r-xl mb-8">
                <h4 className="text-white font-bold text-base m-0">🚨 Contrast Warning</h4>
                <p className="mt-2 text-sm text-slate-300">
                  If you create a custom widget with a dark background shade (like <code>background-color: #222;</code>) and do not explicitly define an interior text color (like <code>color: #fff;</code>), the text will merge with the background on light-theme systems, rendering it completely invisible. Always pair dark background-colors with explicit text colors.
                </p>
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">3. JSON Configuration Schema Boundaries</h4>
              <p className="text-slate-300 mb-4">
                When importing form definitions, the JSON parser expects strict compliance:
              </p>
              <div className="bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-xl mb-8">
                <h4 className="text-white font-bold text-base m-0">⚠️ Schema Warning</h4>
                <p className="mt-2 text-sm text-slate-300">
                  If your custom HTML block contains raw unescaped double quotes (<code>"</code>) or unescaped line breaks, the Form JSON schema validation will fail and reject your import payload. You must use single quotes (<code>'</code>) for HTML attributes inside your JSON, and ensure all multiline structures are kept flat or escaped using explicit newline tokens (<code>\n</code>).
                </p>
              </div>

              <h4 className="text-lg font-bold text-white mt-6 mb-3">4. Automatic Error Resiliency</h4>
              <p className="text-slate-300 mb-6">
                If a developer accidentally leaves an HTML tag open (e.g., a missing <code>&lt;/div&gt;</code>), the Form rendering engine will isolate the node and close it automatically. While this prevents the rest of the SailPoint page from breaking, it can distort your intended layout, so always validate your closing tags.
              </p>

              <hr className="border-white/10 my-10" />

              {/* Section 7: Masterclass Serial Loops */}
              <h3 id="masterclass-dynamic-loops" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">The Masterclass: Dynamic HTML Compilation via Serial Loops</h3>
              <p className="text-slate-300 mb-6">
                Now that we understand the visual thresholds of the Form body, let's explore how to dynamically inject customized HTML widgets into your forms using SailPoint Workflows.
              </p>
              <p className="text-slate-300 mb-6">
                Instead of writing static text, you can initialize a workflow string variable, run a <strong className="text-white">serial loop</strong> to iterate over a collection of objects, and concatenate stylized HTML fragments. This compiled variable is then passed directly into a form's input block.
              </p>

              {/* Visual Flowchart */}
              <div className="my-10 bg-slate-900/40 rounded-2xl border border-white/10 p-6 md:p-8">
                <div className="text-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">Dynamic HTML Compilation Loop Flow</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {/* Phase 1: Setup */}
                  <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">1</span>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide">Initialization</h4>
                    </div>
                    <div className="text-xs text-slate-400 space-y-3">
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Start Workflow</span>
                        <p className="mt-1">Launched via administrative process or schedule.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Define Variable</span>
                        <p className="mt-1">Initialize empty string variable <code>inputloopbuilder</code>.</p>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Processing Loop */}
                  <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-xl border border-white/5 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">2</span>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide">Serial Loop Execution</h4>
                    </div>
                    <div className="text-xs text-slate-400 space-y-3">
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-blue-400 font-bold">HTTP Request</span>
                        <p className="mt-1">Query identities list from SailPoint REST endpoint.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 ring-1 ring-cyan-500/30">
                        <span className="text-cyan-400 font-bold">Update Variable Transform</span>
                        <p className="mt-1">Concatenate and append custom-styled HTML table for each user to builder string.</p>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Display */}
                  <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">3</span>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wide">Rendering Dashboard</h4>
                    </div>
                    <div className="text-xs text-slate-400 space-y-3">
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-purple-400 font-bold">Interactive Form Step</span>
                        <p className="mt-1">Pass compiled HTML string as a variable input.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        <span className="text-white font-bold">Form UI Render</span>
                        <p className="mt-1">Render beautifully-styled, high-density HTML dashboard inside user form.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xl text-white mt-8 mb-3">Setup Walkthrough: The Form Customization Tester Workflow</h4>
              <p className="text-slate-300 mb-6">
                Let's build a real-world example. We'll construct a workflow that grabs a list of identities from the SailPoint tenant, loops through them to build an identity context block featuring a profile summary, an identity state badge, and an accordion detail wrapper, and presents it in a custom form layout.
              </p>
              <p className="text-slate-300 mb-6">
                Here is how the workflow is defined:
              </p>

              <h5 className="text-white font-bold mt-6 mb-2">Step 1: Initialize the Loop Variable</h5>
              <p className="text-slate-300 mb-3">
                Add a <strong className="text-white">Define Variable</strong> step at the start of your workflow. Create a string variable called <code>inputloopbuilder</code> and leave it empty (or initialize it with an outer wrapping CSS layout tag).
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`"Define Variable": {
  "actionId": "sp:define-variable",
  "attributes": {
    "id": "sp:define-variable",
    "variables": [
      {
        "description": "",
        "name": "inputloopbuilder",
        "transforms": []
      }
    ]
  },
  "nextStep": "HTTP Request",
  "type": "Mutation"
}`}</code></pre>
              </div>

              <h5 className="text-white font-bold mt-6 mb-2">Step 2: Fetch the Core Identities</h5>
              <p className="text-slate-300 mb-3">
                Use an <strong className="text-white">HTTP Request</strong> step to query your target identities list from the API:
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-1 mb-4">
                <li><strong>Endpoint:</strong> <code>GET /v2026/identities</code></li>
              </ul>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`"HTTP Request": {
  "actionId": "sp:http",
  "attributes": {
    "method": "get",
    "param_authenticationRef": "oauth",
    "requestContentType": "json",
    "url": "https://{{your-tenant}}.api.identitynow.com/v2026/identities"
  },
  "nextStep": "Serial Loop",
  "type": "action",
  "versionNumber": 3
}`}</code></pre>
              </div>

              <h5 className="text-white font-bold mt-6 mb-2">Step 3: Run the Serial Loop Iteration</h5>
              <p className="text-slate-300 mb-3">
                Add a <strong className="text-white">Serial Loop</strong> step to iterate over the HTTP response body:
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-1 mb-4">
                <li><strong>Input Array:</strong> <code>$.hTTPRequest.body</code></li>
              </ul>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`"Serial Loop": {
  "actionId": "sp:serial:iterator",
  "attributes": {
    "input.$": "$.hTTPRequest.body",
    "loopType": "forLoop",
    "start": "Update Variable",
    "steps": {
      ...
    }
  },
  "nextStep": "Interactive Form",
  "type": "action",
  "versionNumber": 1
}`}</code></pre>
              </div>

              <h5 className="text-white font-bold mt-6 mb-2">Step 4: Concatenate the Custom HTML block</h5>
              <p className="text-slate-300 mb-3">
                Inside the serial loop, add an <strong className="text-white">Update Variable</strong> step. Use the <code>sp:transform:concatenate:string</code> transform to append the stylized HTML table structure for the current identity to <code>$.defineVariable.inputloopbuilder</code>:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`"Update Variable": {
  "actionId": "sp:update-variable",
  "attributes": {
    "id": "sp:update-variable",
    "variables": [
      {
        "name": "$.defineVariable.inputloopbuilder",
        "variableA.$": "$.defineVariable.inputloopbuilder",
        "transforms": [
          {
            "id": "sp:transform:concatenate:string",
            "input": {
              "variableB": "<table style='width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #cfd8dc; border-left: 5px solid #3498db; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04); font-family: sans-serif; margin-bottom: 12px;'><tr><td style='padding: 12px; width: 35%;'><span style='font-weight: bold; font-size: 14px; color: #1e293b;'>👤 {{$.loop.loopInput.attributes.displayName}}</span><br><span style='font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;'>{{$.loop.loopInput.attributes.title}}</span><br><span style='font-size: 11px; color: #94a3b8;'>UID: <code style='font-family: monospace; color: #d63384;'>{{$.loop.loopInput.attributes.uid}}</code></span></td><td style='padding: 12px; width: 40%; font-size: 12px; color: #334155; vertical-align: top;'>📧 <span style='font-family: monospace; color: #e11d48;'>{{$.loop.loopInput.emailAddress}}</span><br>📍 Location: <strong style='color: #475569;'>{{$.loop.loopInput.attributes.location}}</strong><br>👔 Manager: <span style='font-size: 11px; opacity: 0.85; font-weight: bold;'>{{$.loop.loopInput.managerRef.name}}</span></td><td style='padding: 12px; width: 25%; text-align: right; vertical-align: top;'><span style='background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;'>{{$.loop.loopInput.attributes.identityState}}</span></td></tr><tr><td colspan='3' style='padding: 0 12px 12px 12px;'><details style='cursor: pointer; background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;'><summary style='font-weight: bold; font-size: 11px; color: #475569;'>🔍 View Lifecycle & Sync Parameters</summary><div style='margin-top: 8px; font-family: monospace; font-size: 11px; color: #334155; border-top: 1px dashed #cbd5e1; padding-top: 6px; white-space: pre-wrap; word-break: break-all;'>Internal ID: {{$.loop.loopInput.id}}\\nCreated: {{$.loop.loopInput.created}}\\nModified: {{$.loop.loopInput.modified}}\\nLast Sync Signature: {{$.loop.loopInput.attributes.lastSyncDate}}</div></details></td></tr></table>"
            }
          }
        ]
      }
    ]
  },
  "nextStep": "End Step - Success 1",
  "type": "Mutation"
}`}</code></pre>
              </div>

              <h5 className="text-white font-bold mt-6 mb-2">Step 5: Render the Compiled HTML Output in the Form</h5>
              <p className="text-slate-300 mb-3">
                After the loop completes, send the accumulated variable directly into an <strong className="text-white">Interactive Form</strong> step:
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto mb-6 border border-white/10">
                <pre className="text-xs text-cyan-300 m-0"><code>{`"Interactive Form": {
  "actionId": "sp:interactive-form",
  "attributes": {
    "formDefinitionId": "c27dbd2a-dd5c-45c7-bfbe-0c3d518c3f6e",
    "inputForForm_input.$": "$.defineVariable.inputloopbuilder",
    "title": "Form Customization Tester"
  },
  "nextStep": "End Step - Success",
  "type": "action",
  "versionNumber": 1
}`}</code></pre>
              </div>

              <h4 className="text-xl text-cyan-400 mt-8 mb-3">The Rendered Result</h4>
              <p className="text-slate-300 mb-4">
                When the interactive process is launched, the engine loops through your active identities, constructs the table elements, and displays a beautifully structured directory block natively inside the user form:
              </p>

              {/* Image 5 */}
              <div className="my-10 flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center bg-white/5 rounded-t-xl border border-white/10 border-b-0 overflow-hidden p-4">
                    <img 
                      src="/images/blog/form-ui-customization/Loop-Variable-Builder-Customized-Form-1.png" 
                      alt="Form Customization Loop Output"
                      className="max-w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  <div className="bg-[#0d1117] border border-white/10 rounded-b-xl p-4">
                    <span className="text-slate-300 font-bold text-sm">Dynamically Compiled Form Customization Output</span>
                  </div>
                </div>
              </div>

              <hr className="border-white/10 my-10" />

              {/* Section 8: Conclusion */}
              <h3 id="conclusion" className="text-2xl text-white mt-12 mb-4 font-black tracking-tight">Conclusion & Call to Action</h3>
              <p className="text-slate-300 mb-6 leading-relaxed font-light">
                Form design is often treated as an afterthought in Identity Governance, but it has a massive impact on adoption, accuracy, and operational overhead. By leveraging basic HTML, advanced Flexbox alignments, interactive <code>&lt;details&gt;</code> dropdowns, and dynamic serial loop variables, you can elevate your SailPoint Form UI from a simple input collector to a powerful dashboard experience.
              </p>
              <p className="text-slate-300 mb-12 leading-relaxed font-light">
                If you are looking to deploy this solution or want to implement custom form UI dashboards in your environment, schedule a call with me by using the Talk to an Expert button below.
              </p>

              {/* Downloads Grid */}
              <h3 className="text-2xl text-white mt-12 mb-6 font-black tracking-tight">Configuration Snippets & Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                
                {/* Form Selector Card */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Form Customization Tester (Workflow)</h4>
                    <p className="text-xs text-slate-400 mb-6">Workflow retrieving identities, dynamically building custom HTML elements inside a serial loop, and rendering a directory view inside an interactive form.</p>
                  </div>
                  <a 
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formCustomizationTesterWorkflow, null, 2))}`}
                    download="FormCustomizationTester20260609.json"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto no-underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    FormCustomizationTester20260609.json
                  </a>
                </div>

              </div>

              {/* Consultation / Talk to an Expert Block */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-cyan-950/40 to-teal-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl mt-12">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Need a custom reporting or governance dashboard?</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                    Whether you are developing complex multi-source aggregations, automating task gateways, or deploying customized alert dashboards, custom expert support helps you deploy safely.
                  </p>
                </div>
                <a 
                  href="/contact" 
                  className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 no-underline"
                >
                  Talk to an Expert
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
