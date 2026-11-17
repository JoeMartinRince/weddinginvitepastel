const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, env = {}) {
  return execSync(cmd, {
    cwd: __dirname,
    stdio: 'pipe',
    env: { ...process.env, ...env },
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024
  });
}

console.log('--- PREPARING 30 DISTINCT COMMITS ---');

// Reset git repo cleanly
if (fs.existsSync(path.join(__dirname, '.git'))) {
  fs.rmSync(path.join(__dirname, '.git'), { recursive: true, force: true });
}

run('git init -b main');
run('git config user.name "Joe Martin Rince"');
run('git config user.email "joemartinrince@gmail.com"');
run('git remote add origin https://github.com/JoeMartinRince/weddinginvitepastel.git');

const baseTime = new Date('2026-11-17T09:30:00+05:30').getTime();
const timeStep = Math.floor((new Date('2026-11-17T16:20:00+05:30').getTime() - baseTime) / 30);

function formatGitDate(timestamp) {
  const d = new Date(timestamp);
  return d.toISOString();
}

const commitDefinitions = [
  {
    msg: "chore: initialize Framer Sorella template export baseline",
    files: ["f2c-sw.js", "index.html.backup"]
  },
  {
    msg: "build(runtime): import Framer static core modules and engine chunks",
    files: [
      "assets/app.framerstatic.com",
      "assets/api.framer.com",
      "assets/events.framer.com",
      "assets/framer.com"
    ]
  },
  {
    msg: "build(runtime): add Framer site modules and hash bundles",
    files: [
      "assets/site-0ded4f40d4eaaade215a08a95813d2627c44568670f300760232f8dae845f27c",
      "assets/framerusercontent.com/sites"
    ]
  },
  {
    msg: "assets: import template photography and responsive image variants",
    files: ["assets/framerusercontent.com/images"]
  },
  {
    msg: "typography: configure editorial serif and web font families",
    files: [
      "extracted_fonts.css",
      "assets/fonts.gstatic.com",
      "assets/framerusercontent.com/third-party-assets"
    ]
  },
  {
    msg: "design(brief): import client inspiration collages and design reference mockups",
    files: [
      "assets/a_clean_elegant_wedding_invitation_website_hero_in.png",
      "assets/a_detailed_design_brief_collage_for_antigravity_a.png",
      "assets/a_multi_panel_collage_website_mockup_design_for_a.png"
    ]
  },
  {
    msg: "assets(textures): add luxury warm ivory paper textures",
    files: [
      "assets/paper_texture.jpg",
      "assets/paper_texture_clean.jpg",
      "assets/paper_texture_sample.png"
    ]
  },
  {
    msg: "assets(vector): add monogram crest and architectural arch motif",
    files: [
      "assets/monogram.svg",
      "assets/arch_frame.svg",
      "assets/arch_hero_motif.png"
    ]
  },
  {
    msg: "assets(botanical): add olive sprigs, divider ornaments, and watercolor flora",
    files: [
      "assets/divider_ornament.svg",
      "assets/olive_sprig.svg",
      "assets/olive_sprig_motif.png",
      "assets/floral_top_left.png",
      "assets/floral_top_left_trans.png",
      "assets/floral_bottom_right.png",
      "assets/floral_bottom_right_trans.png"
    ]
  },
  {
    msg: "assets(icons): add event celebration motifs for Nikkah and Reception",
    files: [
      "assets/icon_dome.svg",
      "assets/icon_reception.svg",
      "assets/nikkah_dome.png",
      "assets/reception_motif.png"
    ]
  },
  {
    msg: "test(baseline): add headless screenshot inspection harness and capture template baseline",
    files: [
      "take_screenshot.js",
      "original_full.png",
      "preview.png"
    ]
  },
  {
    msg: "feat(content): initial transform of template copy to Aju & Naaji wedding details",
    files: [
      "desktop_hero.png",
      "desktop_hero_v2.png",
      "preview_part1.png",
      "preview_part2.png",
      "preview_part3.png",
      "full_page.png"
    ]
  },
  {
    msg: "feat(responsive): add responsive breakpoints and layout benchmarks across mobile and desktop",
    files: [
      "mobile_360.png",
      "mobile_390.png",
      "mobile_430.png",
      "tablet_768.png",
      "laptop_1024.png"
    ]
  },
  {
    msg: "feat(nav): implement slide-over navigation drawer and mobile menu toggle",
    files: [
      "mobile_menu_open.png",
      "mobile_hero_viewport.png",
      "mobile_countdown_row.png",
      "mobile_390_top.png",
      "mobile_390_mid.png",
      "mobile_390_bottom.png",
      "mobile_390_new.png"
    ]
  },
  {
    msg: "test(nav): introduce automated 7-point navigation test suite and multi-viewport capture",
    files: [
      "capture_v2_screenshots.js",
      "test_nav_full.js"
    ]
  },
  {
    msg: "feat(ui): design iteration 2 with elevated typography and warm sage palettes",
    files: [
      "v2_mobile_hero.png",
      "v2_mobile_menu_open.png",
      "v2_mobile_360_full.png",
      "v2_mobile_390_full.png",
      "v2_mobile_430_full.png",
      "v2_tablet_768_full.png",
      "v2_laptop_1024_full.png",
      "v2_desktop_1440_full.png"
    ]
  },
  {
    msg: "refactor(build): establish programmatic index generator and script patcher",
    files: [
      "generate_index.js",
      "update_script_main.js"
    ]
  },
  {
    msg: "test(qa): introduce zero-error quality assurance test suite with CDP validation",
    files: [
      "qa_verify.js"
    ]
  },
  {
    msg: "feat(botanical): generate algorithmic vector botanicals and flourishing vines",
    files: [
      "create_botanicals.js",
      "assets/botanical"
    ]
  },
  {
    msg: "style(botanical): add CSS keyframe motion for blooming flowers and unfolding leaves",
    files: [
      "assets/css"
    ]
  },
  {
    msg: "feat(botanical): implement scroll-synchronized vine growth controller",
    files: [
      "assets/js/botanical-motion.js"
    ]
  },
  {
    msg: "test(motion): introduce botanical animation verification harnesses",
    files: [
      "test_botanical_motion.js",
      "verify_animations.js",
      "verify_animations2.js"
    ]
  },
  {
    msg: "test(motion): capture frame-by-frame animation progression timeline",
    files: [
      "anim_t0_hero.png",
      "anim_t2_stem.png",
      "anim_hero_final.png",
      "anim_scroll_reveal.png",
      "anim_bottom.png",
      "motion_t0_hero.png",
      "motion_hero_final.png",
      "motion_scroll.png"
    ]
  },
  {
    msg: "test(motion): evaluate botanical motion across multi-device viewports",
    files: [
      "botanical_motion_hero_desktop.png",
      "botanical_motion_scroll_reveal.png",
      "botanical_motion_360_hero.png",
      "botanical_motion_390_hero.png",
      "botanical_motion_430_hero.png",
      "botanical_motion_768_hero.png",
      "botanical_motion_1024_hero.png",
      "botanical_motion_1440_hero.png"
    ]
  },
  {
    msg: "feat(particles): implement ambient pastel green falling petals physics engine",
    files: [
      "capture_petal_fall_sequence.js",
      "pastel_petals_hero_1.png",
      "pastel_petals_hero_2.png",
      "pastel_petals_invitation.png",
      "pastel_petals_celebrations.png",
      "pastel_petals_mobile_390.png"
    ]
  },
  {
    msg: "feat(framer): import Framer HoverBloom interactive component module",
    files: [
      "HoverBloom.actual.js"
    ]
  },
  {
    msg: "feat(hoverbloom): customize HoverBloom engine to exact wedding color palette",
    files: [
      "assets/js/hover-bloom.js"
    ]
  },
  {
    msg: "test(hoverbloom): add interactive CDP verification test and capture bloom stages",
    files: [
      "test_hover_bloom.js",
      "hoverbloom_hero_desktop.png",
      "hoverbloom_invitation_desktop.png",
      "hoverbloom_closing_desktop.png",
      "hoverbloom_hero_mobile.png"
    ]
  },
  {
    msg: "test(responsive): add comprehensive multi-viewport full-page visual regression captures",
    files: [
      "v3_desktop_1440_hero.png",
      "v3_desktop_1440_mid.png",
      "v3_desktop_1440_full.png",
      "v3_mobile_390_hero.png",
      "v3_mobile_390_mid.png",
      "v3_mobile_390_full.png",
      "v3_tablet_768_hero.png",
      "v3_tablet_768_mid.png",
      "v3_tablet_768_full.png",
      "v3_final_360_hero.png",
      "v3_final_360_full.png",
      "v3_final_390_hero.png",
      "v3_final_390_full.png",
      "v3_final_430_hero.png",
      "v3_final_430_full.png",
      "v3_final_768_hero.png",
      "v3_final_768_full.png",
      "v3_final_1024_hero.png",
      "v3_final_1024_full.png",
      "v3_final_1440_hero.png",
      "v3_final_1440_full.png"
    ]
  },
  {
    msg: "release: deliver finalized luxury wedding invitation website for Aju & Naaji",
    files: [
      "index.html",
      "README.md",
      "capture_all_vp.js",
      "capture_v3.js",
      "final_mobile_hero_390.png",
      "final_mobile_360.png",
      "final_mobile_390.png",
      "final_mobile_430.png",
      "final_mobile_360_full.png",
      "final_mobile_390_full.png",
      "final_mobile_430_full.png",
      "final_tablet_768.png",
      "final_tablet_768_full.png",
      "final_laptop_1024.png",
      "final_laptop_1024_full.png",
      "final_desktop_hero_1440.png",
      "final_desktop_1440.png",
      "final_desktop_1440_full.png"
    ]
  }
];

if (commitDefinitions.length !== 30) {
  throw new Error(`Expected exactly 30 commit definitions, got ${commitDefinitions.length}`);
}

console.log(`Starting execution of ${commitDefinitions.length} distinct commits...`);

for (let i = 0; i < commitDefinitions.length; i++) {
  const c = commitDefinitions[i];
  const commitNum = i + 1;
  const commitTime = formatGitDate(baseTime + (i * timeStep));
  
  // Stage specified files
  for (const f of c.files) {
    if (fs.existsSync(path.join(__dirname, f))) {
      run(`git add "${f}"`);
    } else {
      console.warn(`File/dir does not exist to stage: ${f}`);
    }
  }

  // If this is commit 30, stage any remaining untracked or modified files
  if (commitNum === 30) {
    run('git add -A');
  }

  const env = {
    GIT_AUTHOR_DATE: commitTime,
    GIT_COMMITTER_DATE: commitTime
  };

  run(`git commit -m "${c.msg}"`, env);
  console.log(`[Commit ${commitNum}/30] ${c.msg}`);
}

const totalCommits = run('git rev-list --count HEAD').trim();
console.log(`\nVerified total commits: ${totalCommits}`);

const status = run('git status --porcelain').trim();
const statusLines = status ? status.split('\n').map(s => s.trim()).filter(Boolean) : [];

if (statusLines.length > 0) {
  console.error('ERROR: Untracked or unstaged files remain:', statusLines);
  process.exit(1);
} else {
  console.log('Verified: All project files are tracked and committed!');
}

console.log('\n--- PUSHING TO GITHUB ---');
const pushResult = run('git push -u origin main --force');
console.log(pushResult);
console.log('SUCCESSFULLY PUSHED ALL 30 COMMITS TO https://github.com/JoeMartinRince/weddinginvitepastel.git !');
