// 共通セクション

// 子音と母音の定義
const consonants1 = ["b", "bl", "bm", "br", "c", "c'", "c'l", "ch", "ch'", "ch'r", "chr", "cl", "d", "dl", "dn", "dr", "dz", "dzl", "f", "fl", "fr", "g", "gh", "gl", "gn", "gr", "h", "hl", "hm", "hn", "hng", "hr", "j", "jr", "k", "k'", "k'l", "k'n", "k'r", "kl", "kn", "kr", "l", "m", "n", "ng", "p", "p'", "p'l", "p'm", "p'r", "pl", "pm", "pr", "q", "r", "s", "t", "t'", "t'l", "t'n", "t'r", "tl", "tn", "tr", "v", "x", "z", "zh", "zhr", "zl"];
const vowels1 = ["V", "Wi", "Wu", "iW", "uW"];
const consonants3 = ["f", "fk", "fp", "ft", "l", "lk", "lp", "lt", "m", "mp", "ng", "nk", "nt", "q", "r", "rk", "rp", "rt", "s", "shk", "shp", "sht", "sk", "sp", "st", "xk", "xp", "xt"];

// フォームの要素を取得
const form = document.getElementById('wordGeneratorForm');
const generatedWordsTable = document.getElementById('generatedWords');
const absoluteCaseCheckbox = document.getElementById('absoluteCase');

// 品詞選択時の処理
document.getElementById('partOfSpeech').addEventListener('change', (e) => {
  const partOfSpeech = e.target.value;

  // 「形容詞」「副詞」「前置詞」の場合、絶対格を強制的にオンにする
  if (partOfSpeech === 'adjective' || partOfSpeech === 'adverb' || partOfSpeech === 'preposition') {
    absoluteCaseCheckbox.checked = true;
    absoluteCaseCheckbox.disabled = true; // 強制的にオンで固定
  } else if (partOfSpeech === 'intransitiveVerb' || partOfSpeech === 'transitiveVerb' || partOfSpeech === 'ditransitiveVerb') {
    // 「自動詞」「他動詞」「間目動詞」の場合、絶対格を強制的にオフにする
    absoluteCaseCheckbox.checked = false;
    absoluteCaseCheckbox.disabled = true; // 強制的にオフで固定
  } else {
    // それ以外の品詞の場合、絶対格をユーザーが変更可能にする
    absoluteCaseCheckbox.disabled = false;
  }
});

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

    // 語根はクラス1の名詞の絶対格と同じ形にする
    let wordRootClass1 = word1.replace(/V|W/g, 'a');

    // ③ 音節数が「1」の場合、⑥に飛ぶ
    let consonant3Selected = false;
    if (syllableCount === '2') {
      // ④ 子音2を抽選
      word1 += consonants1[Math.floor(Math.random() * consonants1.length)];
      wordRootClass1 += consonants1[Math.floor(Math.random() * consonants1.length)];
      // ⑤ 母音2を抽選
      const vowel2 = vowels1[Math.floor(Math.random() * vowels1.length)];
      word1 += vowel2;
      wordRootClass1 += vowel2.replace(/V|W/g, 'a');
    }

    // ⑥ 1/3の確率で⑦に進む
    if (Math.random() < 0.33) {
      // ⑦ 子音3を抽選
      const consonant3 = consonants3[Math.floor(Math.random() * consonants3.length)];
      word1 += consonant3;
      wordRootClass1 += consonant3;
      consonant3Selected = true;
    }

    // ⑧ チェックボックス「絶対格」がオンで、かつ子音3が抽選された場合のみ語尾にeを設置
    if (consonant3Selected && absoluteCase) {
      word1 += 'e';
      wordRootClass1 += 'e';
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

    // 品詞ごとの処理
    // ⑩ 品詞に基づいた処理
    switch (partOfSpeech) {
      case 'noun': // 名詞
        break; // 特に追加の処理なし
      case 'adjective': // 形容詞
        if (consonant3Selected) {
          word1 += 'sh';
        } else {
          word1 += 'she';
        }
        break;
      case 'adverb': // 副詞
        if (consonant3Selected) {
          word1 += 'l';
        } else {
          word1 += 'le';
        }
        break;
      case 'preposition': // 前置詞
        if (consonant3Selected) {
          word1 += 'n';
        } else {
          word1 += 'ne';
        }
        break;
      case 'intransitiveVerb': // 自動詞
        if (consonant3Selected) {
          word1 = 'ba=' + word1 + '-uhr-ab-a';
        } else {
          word1 = 'ba=' + word1 + '-hr-ab-a';
        }
        break;
      case 'transitiveVerb': // 他動詞
        if (consonant3Selected) {
          word1 = 'ga=' + word1 + '-uf-ab-a';
        } else {
          word1 = 'ga=' + word1 + '-f-ab-a';
        }
        break;
      case 'ditransitiveVerb': // 間目動詞
        if (consonant3Selected) {
          word1 = 'da=' + word1 + '-ux-ab-a';
        } else {
          word1 = 'da=' + word1 + '-x-ab-a';
        }
        break;
    }

    // ⑪ 単語を出力
    const row = generatedWordsTable.insertRow();
    row.insertCell(0).innerText = word1;
    row.insertCell(1).innerText = wordRootClass1; // 語根出力
  }
}

// クラス転換規則を適用する関数
function applyClassTransformation(wordClass, word) {
  let wordModified = word;
  // 子音1に応じた処理
  if (['b', 'bl', 'bm', 'br', 'd', 'dl', 'dn', 'dr', 'dz', 'dzl', 'f', 'fl', 'fr', 'g', 'gh', 'gl', 'gn', 'gr', 'j', 'jr', 'r', 's', 'v', 'x', 'z', 'zh', 'zhr', 'zl'].includes(word[0])) {
    // 語頭に"s"を設置しない
  } else if (word.startsWith('q')) {
    wordModified = 's\'' + word.slice(1); // qをs'に置換
  } else {
    wordModified = 's' + word; // 語頭に"s"を設置
  }

  // クラスによる母音置換
  if (['4', '5'].includes(wordClass)) {
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
