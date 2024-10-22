// 共通セクション

// 子音と母音の定義
const consonants1 = ["b", "bl", "bm", "br", "c", "c'", "c'l", "ch", "ch'", "ch'r", "chr", "cl", "d", "dl", "dn", "dr", "dz", "dzl", "f", "fl", "fr", "g", "gh", "gl", "gn", "gr", "h", "hl", "hm", "hn", "hng", "hr", "j", "jr", "k", "k'", "k'l", "k'n", "k'r", "kl", "kn", "kr", "l", "m", "n", "ng", "p", "p'", "p'l", "p'm", "p'r", "pl", "pm", "pr", "q", "r", "s", "t", "t'", "t'l", "t'n", "t'r", "tl", "tn", "tr", "v", "x", "z", "zh", "zhr", "zl"];
const vowels1 = ["V", "Wi", "Wu", "iW", "uW"];
const consonants2 = [...consonants1];
const consonants3 = ["f", "fk", "fp", "ft", "l", "lk", "lp", "lt", "m", "mp", "ng", "nk", "nt", "q", "r", "rk", "rp", "rt", "s", "shk", "shp", "sht", "sk", "sp", "st", "xk", "xp", "xt"];

// フォームの要素を取得
const form = document.getElementById('wordGeneratorForm');
const generatedWordsTable = document.getElementById('generatedWords');

// 単語生成関数
function generateWord() {
  // フォームの値を取得
  const partOfSpeech = document.getElementById('partOfSpeech').value;
  const wordClass = document.getElementById('class').value;
  const syllableCount = document.getElementById('syllableCount').value;
  const absoluteCase = document.getElementById('absoluteCase').checked;
  const wordCount = parseInt(document.getElementById('wordCount').value);

  // 生成した単語をクリア
  generatedWordsTable.innerHTML = '';

  for (let i = 0; i < wordCount; i++) {
    // ① 子音1を抽選
    let word1 = consonants1[Math.floor(Math.random() * consonants1.length)];
    let wordRoot = word1;

    // ② 母音1を抽選
    word1 += vowels1[Math.floor(Math.random() * vowels1.length)];

    // ③ 音節数が「1」の場合、⑥に飛ぶ
    if (syllableCount === '2') {
      // ④ 子音2を抽選
      word1 += consonants2[Math.floor(Math.random() * consonants2.length)];
      // ⑤ 母音2を抽選
      word1 += vowels1[Math.floor(Math.random() * vowels1.length)];
    }

    // ⑥ 1/3の確立で⑦に進む
    if (Math.random() < 0.33) {
      // ⑦ 子音3を抽選
      word1 += consonants3[Math.floor(Math.random() * consonants3.length)];
    }

    // ⑧ チェックボックス「絶対格」がオンの場合、語尾にeを設置
    if (absoluteCase) {
      word1 += 'e';
    }

    // クラス処理
    // ⑨ クラスに基づいた処理
    switch (wordClass) {
      case '1': // 男性
        word1 = word1.replace(/V|W/g, 'a');
        break;
      case '2': // 女性
        word1 = word1.replace(/V|W/g, 'e');
        break;
      case '3': // 中性
        word1 = word1.replace(/V/g, Math.random() < 0.67 ? 'i' : 'u')
                     .replace(/Wi/g, 'úi').replace(/Wu/g, 'íu')
                     .replace(/iW/g, 'iú').replace(/uW/g, 'uí');
        break;
      case '4': // 抽象
      case '5': // 物質
      case '6': // 集合
        word1 = applyClassTransformation(wordClass, word1);
        break;
    }

    // 語根はVとWをaに置換し、列2に出力
    wordRoot = wordRoot.replace(/V|W/g, 'a');

    // 品詞ごとの処理
    // ⑩ 品詞に基づいた処理
    switch (partOfSpeech) {
      case 'noun': // 名詞
        break; // 特に追加の処理なし
      case 'adjective': // 形容詞
        word1 += word1.includes(consonants3) ? 'sh' : 'she';
        break;
      case 'adverb': // 副詞
        word1 += word1.includes(consonants3) ? 'l' : 'le';
        break;
      case 'preposition': // 前置詞
        word1 += word1.includes(consonants3) ? 'n' : 'ne';
        break;
      case 'intransitiveVerb': // 自動詞
        word1 = 'ba=' + word1 + (word1.includes(consonants3) ? '-uhr-ab-a' : '-hr-ab-a');
        break;
      case 'transitiveVerb': // 他動詞
        word1 = 'ga=' + word1 + (word1.includes(consonants3) ? '-uf-ab-a' : '-f-ab-a');
        break;
      case 'ditransitiveVerb': // 間目動詞
        word1 = 'da=' + word1 + (word1.includes(consonants3) ? '-ux-ab-a' : '-x-ab-a');
        break;
    }

    // ⑪ 列1に単語を出力
    const row = document.createElement('tr');
    row.innerHTML = `<td>${word1}</td><td>${wordRoot}</td>`;
    generatedWordsTable.appendChild(row);
  }
}

// クラス転換規則を適用
function applyClassTransformation(wordClass, word) {
  let wordModified = word;

  if (wordClass === '4' || wordClass === '5' || wordClass === '6') {
    // クラス転換規則
    const firstConsonant = word[0];
    if (["b", "bl", "bm", "br", "d", "dl", "dn", "dr", "dz", "dzl", "f", "fl", "fr", "g", "gh", "gl", "gn", "gr", "j", "jr", "r", "s", "v", "x", "z", "zh", "zhr", "zl"].includes(firstConsonant)) {
      // 語頭にsを設置しない
    } else if (firstConsonant === 'q') {
      // 語頭のqをs'に置換
      wordModified = wordModified.replace(/^q/, "s'");
    } else {
      // 語頭にsを設置
      wordModified = "s" + wordModified;
    }
  }

  // クラスによる母音置換
  if (wordClass === '4' || wordClass === '5') {
    wordModified = wordModified.replace(/V|W/g, wordClass === '4' ? 'a' : 'e');
  } else if (wordClass === '6') {
    wordModified = wordModified.replace(/V/g, Math.random() < 0.67 ? 'i' : 'u')
                               .replace(/Wi/g, 'úi').replace(/Wu/g, 'íu')
                               .replace(/iW/g, 'iú').replace(/uW/g, 'uí');
  }

  return wordModified;
}

// 生成ボタンのイベントリスナーを追加
document.getElementById('generateButton').addEventListener('click', generateWord);
