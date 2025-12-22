import { getAllLessons, getFAQs } from '../lib/markdown';

async function testMarkdownLoading() {
  console.log('=== TESTING MARKDOWN LOADING ===\n');

  console.log('1. Testing getAllLessons()...');
  const startLessons = Date.now();
  try {
    const lessons = await getAllLessons();
    const timeLessons = Date.now() - startLessons;
    console.log(`  ✅ SUCCESS: Loaded ${lessons.length} lessons in ${timeLessons}ms`);
    console.log(`  Lessons:`);
    lessons.forEach(l => console.log(`    - Level ${l.metadata.level}: ${l.metadata.title}`));
  } catch (error) {
    const timeLessons = Date.now() - startLessons;
    console.log(`  ❌ FAILED after ${timeLessons}ms`);
    console.error(`  Error:`, error);
  }

  console.log('\n2. Testing getFAQs()...');
  const startFAQs = Date.now();
  try {
    const faqs = await getFAQs();
    const timeFAQs = Date.now() - startFAQs;
    console.log(`  ✅ SUCCESS: Loaded ${faqs.length} FAQs in ${timeFAQs}ms`);
    console.log(`  FAQs:`);
    faqs.slice(0, 5).forEach(f => console.log(`    - ${f.question}`));
    console.log(`    ... and ${faqs.length - 5} more`);
  } catch (error) {
    const timeFAQs = Date.now() - startFAQs;
    console.log(`  ❌ FAILED after ${timeFAQs}ms`);
    console.error(`  Error:`, error);
  }

  console.log('\n=== TEST COMPLETE ===');
}

testMarkdownLoading();
