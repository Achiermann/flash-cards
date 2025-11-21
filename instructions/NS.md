ONLY follow the following instructions if explicitly told:

<!-- .1 Task -->

In components create the folder conjugator.js
Conjugator.js should include a component that renders a separate screen on top of the whole content
that fetches to "https://konjugator.reverso.net/konjugation-italienisch-verb-aprire.html" 
This leads to a page that should be fetched. 
Conjugator.js includes a list of conjugated verb forms. In this URL its the word aprire that is being conjugated.
Conjugator.js includes boxes with the classname "verb-term-conjugation-box".
Each row displayed in conjugator.js keeps three of these boxes. The boxes contain the content of each
"blue-box-wrap" fetched from the URL. So each box displays the content inside the <p> </p>of the class "mobile-title" of each "blue-box-wrap" as its title.
further in the "blue-box-wrap" youll find "wrap-verbs-listing" with <li> items. this content should all be displayed in each verb-term-conjugation-box. 

Check "/public/Screenshot 2025-11-21 at 09.13.33.png" for a screenshot. this is how the content should be displayed.

In the layout include a button that will display the conjugator.js

<!-- .2 Disclaimer -->

Don`t make any other changes then the ones explicitly mentioned here or in any of the mentioned instruction-files.
**Make USE of Vercel and Supabase MCP**
**You dont have to push changes to gitHub, ill do that manually**
Follow DECISIONS.md, CLAUDE.md, STYLE-GUIDE.md, TESTING.md, PROMPT.md
