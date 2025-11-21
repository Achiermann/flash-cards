import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const verb = searchParams.get('verb') || 'aprire';

  try {
    const url = `https://konjugator.reverso.net/konjugation-italienisch-verb-${verb}.html`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch conjugations from Reverso' },
        { status: 500 }
      );
    }

    const html = await response.text();

    // Log a sample of the HTML to understand structure
    const sampleMatch = html.match(/blue-box-wrap[\s\S]{0,500}/);
    if (sampleMatch) {
      console.log('Sample HTML around blue-box-wrap:', sampleMatch[0]);
    }

    // Parse the HTML to extract conjugation boxes
    const conjugations = parseConjugations(html);

    console.log('Number of conjugations parsed:', conjugations.length);
    if (conjugations.length > 0) {
      console.log('First conjugation:', JSON.stringify(conjugations[0]));
    }

    return NextResponse.json({ conjugations });
  } catch (error) {
    console.error('Error in conjugator API:', error);
    return NextResponse.json(
      { error: 'Error fetching conjugations' },
      { status: 500 }
    );
  }
}

function parseConjugations(html) {
  const conjugations = [];

  // Match all blue-box-wrap sections with mobile-title attribute
  const blueBoxRegex = /<div[^>]*class="[^"]*blue-box-wrap[^"]*"[^>]*mobile-title="([^"]*)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;

  while ((match = blueBoxRegex.exec(html)) !== null) {
    const title = match[1]; // mobile-title attribute value
    const boxContent = match[2]; // Content inside the div

    // Extract the <p> tag content for display title
    const pMatch = boxContent.match(/<p[^>]*>(.*?)<\/p>/);
    const displayTitle = pMatch ? stripHtmlTags(pMatch[1]) : title;

    // Extract conjugations from wrap-verbs-listing
    const listMatch = boxContent.match(/<ul[^>]*class="[^"]*wrap-verbs-listing[^"]*"[^>]*>([\s\S]*?)<\/ul>/);

    if (listMatch) {
      const listContent = listMatch[1];
      const liRegex = /<li[^>]*>(.*?)<\/li>/g;
      const items = [];
      let liMatch;

      while ((liMatch = liRegex.exec(listContent)) !== null) {
        const itemText = stripHtmlTags(liMatch[1]);
        if (itemText.trim()) {
          items.push(itemText.trim());
        }
      }

      if (displayTitle && items.length > 0) {
        conjugations.push({
          title: displayTitle.trim(),
          conjugations: items
        });
      }
    }
  }

  return conjugations;
}

function stripHtmlTags(str) {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}
