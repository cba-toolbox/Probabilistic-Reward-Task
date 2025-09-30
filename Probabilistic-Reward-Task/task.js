/**
 * task.js
 * jsPsych 7.0 ライブラリのフレームワークを用いて作成した Probabilistic Reward 課題を行うスクリプトです。
 */

/////////////////////////////////////////////////
// 課題の設定

/**
 * ユーザー定義の設定をします。
 * 教示および刺激に用いる画像ファイルが入ったフォルダーのパスと、
 * フォルダ内の画像の名前を設定します。
 * すべての刺激画像は同一のフォルダーに入っている必要があります。
 */
const getUserDefinedSettings = () => ({

  /**
   * 課題の生成パターンを指定します。
   * 下記のパターンから選択します。
   * 1: キー応答: 左 (F キー) → 口の長さ: short, 頻度: frequent、  キー応答: 右 (J キー) → 口の長さ: long,  頻度: infrequent
   * 2: キー応答: 左 (F キー) → 口の長さ: long,  頻度: frequent、  キー応答: 右 (J キー) → 口の長さ: short, 頻度: infrequent
   * 3: キー応答: 左 (F キー) → 口の長さ: short, 頻度: infrequent、キー応答: 右 (J キー) → 口の長さ: long,  頻度: frequent
   * 4: キー応答: 左 (F キー) → 口の長さ: long,  頻度: infrequent、キー応答: 右 (J キー) → 口の長さ: short, 頻度: frequent
   * 1 ～ 4 をランダムに生成する場合には 0 を指定します。
   */
  pattern: 0,

  /**
   * 課題で使用する画像が格納されているフォルダーのパスです。
   */
  sourceFolderPath: 'probabilistic-reward-task/source',

  /**
   * 刺激に用いる画像ファイルの名前を指定します。
   * signal (口の無い顔)、short (短い口の顔)、long (長い口の顔) について設定します。
   * long:short = 13:11.5 の比率 at
   */
  stimuli: [
    { mouth: 'signal', image: 'face-signal.png' },
    { mouth: 'short', image: 'face-with-mouth-short.png' },
    { mouth: 'long', image: 'face-with-mouth-long_ver.png' },
  ],

  /**
   * 固視点を表示する時間 (msec) です。
   */
  fixationDuration: 500,

  /**
   * シグナル (口の無い顔) が表示される時間 (msec) です。
   */
  signalDuration: 500,


  /**
   * ターゲット (口がある顔) が表示される時間 (msec) です。
   */
  stimulusDuration: 100,

  /**
   * 顔画像の高さ (px) です。
   * デフォルトでは画面高さの 18% に設定しています。
   */
  faceImageheight: window.screen.height * 0.18,

  /**
   * フィードバックが表示される時間 (msec) です。
   */
  feedbackDuration: 1750,

  /**
   * 本番課題時の小休止の時間 (msec) です。
   */
  breakTimeDuration: 30000,

  /**
   * 正しい応答により得られる 1 回あたりの金額です。
   */
  rewardAmount: 5,

  /**
   * rewardAmount の単位です。
   */
  unit: 'ポイント',

});

/////////////////////////////////////////////////
// 課題の構成

/**
 * jsPsych ライブラリのフレームワークに従って課題を構成します。
 * @returns 課題のタイムライン
 */
const prepareTimeline = () => {
  // 設定を読み込みます。
  const settings = prepareSettings();

  return [
    // フルスクリーン表示に切り替えます。
    setFullScreen(),

    // 試行に必要な画像データを事前にロードします。
    preloadData(settings),

    // マウス カーソルを非表示にします。
    setCursorVisibility(false),

    // 課題の説明文を表示します。
    showTaskInstruction(settings, 'demo'),

    // デモ課題を行います。
    doDemoTrial(settings),

    // 練習課題の説明文を表示します。
    showTaskInstruction(settings, 'practice'),

    // 練習課題を行います。
    doPracticeTrial(settings),

    // 本番課題の説明文を表示します。
    showTaskInstruction(settings, 'main'),

    // 本番課題を行います。
    doMainTrial(settings),

    // マウス カーソルを表示にします。
    setCursorVisibility(true),

    // 課題の終了文を表示します。
    showEndInstruction(timeline),

    // フルスクリーン表示を解除します。
    cancelFullScreen(),
  ];
};

/////////////////////////////////////////////////
//// 課題の構成要素

/**
 * 画面をフルスクリーン表示に切り替えます。
 * @returns 試行オブジェクト
 */
const setFullScreen = () => {
  // jspsych_init.js スクリプトで fullscreen 全画面表示オブジェクトがすでに
  // 定義されている場合は、それを返します。そうで無い場合は新規に生成して返します。
  if (typeof fullscreen !== 'undefined') {
    return fullscreen;
  } else {
    return {
      type: jsPsychFullscreen,
      message: "<p><span style='font-size:20pt;'>それでは課題をはじめます。</span></p>" +
        "<p><span style='font-size:20pt;'>以下の「開始」を押すと、全画面になって課題がはじまります。</span></p>" +
        "<p><span style='font-size:20pt;'>課題を途中で終了する場合は、エスケープ キーを押して全画面を解除し、</span></p>" +
        "<p><span style='font-size:20pt;'>ブラウザーを閉じてください。</span></p>",
      button_label: "<p style='font-size:20px'>開始</p>",
      fullscreen_mode: true,
      data: {
        name: 'full screen'
      }
    };
  }
};

/**
 * 試行に必要な画像データを事前にロードします。
 * @param {*} settings
 */
const preloadData = (settings) => {
  let imageData = [];
  // 画像のパスを設定します。
  settings.stimSourceMap.forEach((value) => {
    imageData.push(value);
  });
  return {
    type: jsPsychPreload,
    images: imageData,
    data: {
      name: 'pre load'
    }
  }
};

/**
 * マウス カーソルの表示/非表示状態を設定するブロック定義を生成します。
 * @param {boolean} visibility 表示/非表示状態
 */
const setCursorVisibility = (visibility) => ({
  type: jsPsychCallFunction,
  func: () => {
    document.body.style.cursor = visibility ? 'auto' : 'none';
  },
  data: {
    name: `cursol visibility ${visibility}`
  }
});

/**
 * 課題開始時の説明文を表示します。
 * @param {string} phase: 課題の種類を表す 'demo'、'practice'、'main' のいずれかの文字列です。
 */
const showTaskInstruction = (settings, phase) => {

  // 一連の説明文を定義します。
  const instructionMessages = () => {
    // 顔画像の表示レイアウトです。
    const instructionImage = `
      <div id="instruction_face">
        <img src="${settings.stimSourceMap.get(settings.taskPattern.f.mouth)}" class="face">
        <div style="display: inline-block; width: 20vw;"></div>
        <img src="${settings.stimSourceMap.get(settings.taskPattern.j.mouth)}" class="face">
      </div>
      <div id="instruction_key">
        <div class="key">${settings.keynaviMap.get(settings.taskPattern.f.mouth)}: 左 ( F ) キーを押します。</div>
        <div class="key">${settings.keynaviMap.get(settings.taskPattern.j.mouth)}: 右 ( J ) キーを押します。</div>
      </div>`;

    // デモを始める際の教示文です。
    if (phase == 'demo') {
      return `
        <div id="instruction_message1">
          これから、口の長さがわずかに違う顔のイラストが一瞬だけ表示されます。<br>
          口の長さは、短い口と長い口の 2 種類です。<br>
          口の長さに応じて 2 つのカテゴリにイラストを分類してください。</div>
          ${instructionImage}
        <div id="instruction_message2">
          本番では、イラストを正しく分類するとポイントが獲得できます。<br>
          できるだけ多くのポイントを獲得するように選択してください。</div>
        <div id="startmessage">スペース キーを押すと、分類方法の説明が始まります。</div>`;
    // 練習を始める際の教示文です。
    } else if (phase == 'practice') {
      return `
        <div id="instruction_message1">それでは、練習を始めます。</div>
        <div id="instruction_message2">
          口の長さがわずかに違う顔のイラストが一瞬だけ表示されます。<br>
          口の長さに応じて、2 つのカテゴリにイラストを分類してください。</div>
         ${instructionImage}<br>
        <div id="startmessage">スペース キーを押すと、練習が始まります。</div>`;
    // 本番を始める際の教示文です。
    } else {
      return `
        <div id="instruction_message1">
          それでは、本番を始めます。<br>
          <b>イラストを正しく分類すると ${settings.rewardAmount} ${settings.unit} 獲得できることがあります。</b><br>
          <b>すべての正しい分類でポイントが獲得できるわけではありません。</b><br></div>
        <div id="instruction_message2">
          <b>できるだけ多くのポイントを獲得するように選択してください。</b></div>
         ${instructionImage}<br>
        <div id="startmessage">スペース キーを押すと、本番が始まります。</div>`;
    }
  };

  // 教示文を定義します。
  const instruction = {
    stimulus: instructionMessages(),
    choices: ' ',
    data: {
      name: 'instruction' + `${phase}`
    }
  };

  // 課題が始まることを喚起する文章を定義します。
  const getReady = {
    stimulus: `<div><br>指を F キーと J キーに置いてください。<br>準備ができたらスペースキーを押してください。</div>`,
    //trial_duration: 5000,
    choices: ' ',
    data: {
      name: 'instruction' + `${phase}`
    }
  };

  return {
    type: jsPsychHtmlKeyboardResponse,
    timeline: [instruction, getReady],
    prompt: `
    <div id="keynavi" style="left: 35%;">${settings.keynaviMap.get(settings.taskPattern.f.mouth)}</div>
    <div id="keynavi" style="left: 65%;">${settings.keynaviMap.get(settings.taskPattern.j.mouth)}</div>`
  };
};

/**
 * 2 種類の刺激画像、およびそれに対するキー押下の結果を 1 回ずつ表示するブロックを生成します。
 * 画像に対応する正しいキーのみ押下できます。
 * 短い口の画像 → 長い口の画像の順番に表示します。
 */
const doDemoTrial = (settings) => {
  const stimulusPattern = [
    { stimulus: settings.stimSourceMap.get('short'), key_choice: settings.key_short, correct_key: settings.key_short, prompt: settings.keynaviMap.get('short')},
    { stimulus: settings.stimSourceMap.get('long'), key_choice: settings.key_long, correct_key: settings.key_long, prompt: settings.keynaviMap.get('long') }];
  return {
    timeline: [fixation(settings), signal_noKey(settings), faceStimulus(settings), signal_withPrompt(settings), feedback(settings)],
    timeline_variables: stimulusPattern,
    prompt: `
    <div id="keynavi" style="left: 35%;">${settings.keynaviMap.get(settings.taskPattern.f.mouth)}</div>
    <div id="keynavi" style="left: 65%;">${settings.keynaviMap.get(settings.taskPattern.j.mouth)}</div>`,
  };
};

/**
 * 2 種類の刺激画像、およびそれに対するキー押下の正誤を 1 回ずつ表示するブロックを生成します。
 * practice の場合は、2 種類のキーが押下できます。
 * 画像の表示順序はランダムです。
 */
 const doPracticeTrial = (settings) => {
  const stimulusPattern = [
    { stimulus: settings.stimSourceMap.get('short'), correct_key: settings.key_short, prompt: settings.keynaviMap.get('short') },
    { stimulus: settings.stimSourceMap.get('long'), correct_key: settings.key_long, prompt: settings.keynaviMap.get('long') }];
  return {
    timeline: [fixation(settings), signal_noKey(settings), faceStimulus(settings), signal(settings), feedback(settings)],
    timeline_variables: stimulusPattern,
    randomize_order: true,
    prompt: `
    <div id="keynavi" style="left: 35%;">${settings.keynaviMap.get(settings.taskPattern.f.mouth)}</div>
    <div id="keynavi" style="left: 65%;">${settings.keynaviMap.get(settings.taskPattern.j.mouth)}</div>`,
  };
};

/**
 * 本番用の課題ブロックを生成します。
 * 100 回の刺激表示、小休止 を繰り返します。
 */
 const doMainTrial = (settings) => {
  const stimulusPattern = generateStimulusPattern(settings);
  return {
    timeline: [fixation(settings), signal_noKey(settings), faceStimulus(settings), signal_setReward(settings), rewardFeedback(settings), breakTimeOrNot(settings)],
    timeline_variables: stimulusPattern,
    on_timeline_start: () => {
      jsPsych.data.newRewardFlag_frequent = false;    // frequent 刺激が new_rewawrd であるか否かを表す bool 値です。
      jsPsych.data.newRewardFlag_infrequent = false;  // infrequent 刺激が new_rewawrd であるか否かを表す bool 値です。
      jsPsych.data.feedbackFlag = false;              // 報酬を獲得したことを表示するか否かを表す bool 値です。
    },
    prompt: `
    <div id="keynavi" style="left: 35%;">${settings.keynaviMap.get(settings.taskPattern.f.mouth)}</div>
    <div id="keynavi" style="left: 65%;">${settings.keynaviMap.get(settings.taskPattern.j.mouth)}</div>`,
  };
};

/**
 * 固視点の表示を定義します。
 */
 const fixation = (settings) => ({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 10vh;">+</p>', // 画面の 10% の大きさに設定します。
  trial_duration: settings.fixationDuration,
  choices: 'NO_KEYS',
  data: {
    name: 'fixation',
  }
});

/**
 * キー押下を許容しないシグナル表示を定義します。
 */
const signal_noKey = (settings) => ({
  type: jsPsychImageKeyboardResponse,
  stimulus: settings.stimSourceMap.get('signal'),
  stimulus_height: settings.faceImageheight,
  trial_duration: settings.signalDuration,
  choices: 'NO_KEYS',
  data: {
    name: 'signal no key',
  }
});

/**
 * ターゲット刺激の表示を定義します。
 */
const faceStimulus = (settings) => ({
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  stimulus_height: settings.faceImageheight,
  choices: 'NO_KEYS',
  trial_duration: settings.stimulusDuration,
  data: {
    name: 'face stimulus',
    trial_count: jsPsych.timelineVariable('trial_count'),
    reward: jsPsych.timelineVariable('reward'),
    new_reward: jsPsych.data.newRewardFlag
  }
});

/**
 * キー押下を取得するシグナル表示を定義します。
 * 直前に示された刺激画像の情報を合わせて表示します。
 * デモ課題で使用します。
 */
const signal_withPrompt = (settings) => {

  return {
    type: jsPsychImageKeyboardResponse,
    stimulus: settings.stimSourceMap.get('signal'),
    stimulus_height: settings.faceImageheight,
    choices: jsPsych.timelineVariable('key_choice'),
    prompt: () => {
      // キーの大文字表記を設定します。
      let keyExpression = (jsPsych.timelineVariable('key_choice') == 'f') ? 'F' : 'J';
      return `
      <div id="keynavi" style="left: 35%;">${settings.keynaviMap.get(settings.taskPattern.f.mouth)}</div>
      <div id="keynavi" style="left: 65%;">${settings.keynaviMap.get(settings.taskPattern.j.mouth)}</div>
      <div style="position: absolute; transform: translate(-50%, 0%); left: 50%; top: 70vh; font-size: 24px;">
      ${jsPsych.timelineVariable('prompt')}の顔が表示されました。
      ${keyExpression} キーを押してください。</div>`},
    data: {
      name: 'signal with prompt',
      correct_key: jsPsych.timelineVariable('correct_key')
    },
    on_finish: (data) => {
      let response = jsPsych.data.get().last(1).values()[0];
      data.correct = (response.correct_key == response.response);
    }
  }
};

/**
 * キー押下を取得するシグナル表示を定義します。
 * 押下の正誤を合わせて記録します。
 * デモおよび練習課題で使用します。
 */
 const signal = (settings) => ({
  type: jsPsychImageKeyboardResponse,
  stimulus: settings.stimSourceMap.get('signal'),
  stimulus_height: settings.faceImageheight,
  choices: ['f', 'j'],
  data: {
    name: 'signal',
    correct_key: jsPsych.timelineVariable('correct_key'),
  },
  on_finish: (data) => {
    // キー反応の正誤を記録します。
    let response = jsPsych.data.get().last(1).values()[0];
    data.correct = (response.correct_key == response.response);
  }
});

/**
 * キー押下を取得するシグナル表示を定義します。
 * 押下の正誤、reward および new_reward に関する情報を合わせて記録します。
 * 本番の課題で使用します。
 */
 const signal_setReward = (settings) => ({
  type: jsPsychImageKeyboardResponse,
  stimulus: settings.stimSourceMap.get('signal'),
  stimulus_height: settings.faceImageheight,
  choices: ['f', 'j'],
  data: {
    name: 'signal for reward',
    correct_key: jsPsych.timelineVariable('correct_key'),
    frequency: jsPsych.timelineVariable('frequency'),
    reward: jsPsych.timelineVariable('reward'),
  },
  on_finish: (data) => {
    // キー反応の正誤とフラグを記録します。
    let response = jsPsych.data.get().last(1).values()[0];
    data.correct = (response.correct_key == response.response);
    data.new_reward_frequent = jsPsych.data.newRewardFlag_frequent;
    data.new_reward_infrequent = jsPsych.data.newRewardFlag_infrequent;

    // 次の試行のための feedbackFlag、newRewardFlag_frequent、newRewardFlag_infrequent を設定します。
    // キー応答が正しい場合です。
    if (data.correct) {
      // reward が true の場合です。
      if (response.reward) {
        jsPsych.data.feedbackFlag = true;

        // newRewardFlag_frequent が true の場合です。
        if (response.new_reward_frequent) {
          jsPsych.data.newRewardFlag_frequent = (response.frequency != 'frequent');
        }
        // newRewardFlag_infrequent が true の場合です。
        if (response.new_reward_infrequent) {
          jsPsych.data.newRewardFlag_infrequent = (response.frequency != 'infrequent');
        }

      // reward が false の場合です。
      } else {
        jsPsych.data.feedbackFlag = false;
        // newRewardFlag_frequent が true の場合です。
        if (response.new_reward_frequent) {
          if (response.frequency == 'frequent') {
            jsPsych.data.feedbackFlag = true;
            jsPsych.data.newRewardFlag_frequent = false;
          }
        }
        if (response.new_reward_infrequent) {
          if (response.frequency == 'infrequent') {
            jsPsych.data.feedbackFlag = true;
            jsPsych.data.newRewardFlag_infrequent = false;
          }
        }
      }
    // キー応答が誤っている場合です。
    } else {
      jsPsych.data.feedbackFlag = false;
      // reward が true の場合です。
      if (response.reward) {
        if (response.frequency == 'frequent') {
          jsPsych.data.newRewardFlag_frequent = true;
        } else {
          jsPsych.data.newRewardFlag_infrequent = true;
        }
      }
    }
  }
});

/**
 * キー押下の正誤のフィードバックをします。
 * デモおよび練習課題で使用します。
 */
 const feedback = (settings) => ({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
      // キー反応の正誤を取得します。
      return jsPsych.data.get().last(1).values()[0].correct ? `<div style="font-size: 40pt; color: #00B050;">正解</div>` : `<div style="font-size: 40pt; color: #FF0000">不正解</div>`;
    },
  trial_duration: settings.feedbackDuration,
  choices: 'NO_KEYS',
  data: {
    name: 'feed back'
  }
});

/**
 * reward または new_reward の刺激に対する反応が正しい場合に、
 * 報酬を計算し、表示します。
 * 本番の課題で使用します。
 */
const rewardFeedback = (settings) => {
  let totalAmount = 0;
  return {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    if (jsPsych.data.feedbackFlag) {
      totalAmount += settings.rewardAmount;
      return `
      <div style="font-size: 40pt; color: #00B050;">${settings.rewardAmount} ${settings.unit}獲得<br></div>`;
    } else {
      return '';
    }
  },
  trial_duration: () => {
    return jsPsych.data.feedbackFlag ? settings.feedbackDuration : 0;
  },
  choices: 'NO_KEYS',
  data: {
    name: 'reward',
    reward: jsPsych.timelineVariable('reward')
    }
  }
};

/**
 * タイマーを表示するか否かを判定します。
 * 100 回目および 200 回目が終了した後に表示します。
 */
const breakTimeOrNot = (settings) => ({
  timeline: [timer(settings)],
  conditional_function: () => {
    let count = jsPsych.timelineVariable('trial_count');
    return (count == 100) || (count  == 200);
  },
  choices: 'NO_KEYS',
  data: {
    name: 'break time or not',
  }
});

/**
 * 100 回の試行毎にタイマーを表示します。
 */
const timer = (settings) => ({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div>小休止です。タイマーの時間が 0 になると再開します。<br></div>
    <div id="stopwatch">00:00</div>`,
  choices: 'NO_KEYS',
  trial_duration: settings.breakTimeDuration,
  on_load: () => {
    countDown(settings);
  },
  data: {
    name: 'break time',
  }
});

/**
 * 課題の終了文を表示するブロック定義を生成します。
 * @returns 課題の終了文表示を表すブロック定義
 */
const showEndInstruction = () => ({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <p style="font-size: 24px; line-height: 1.8em; text-align: left; width: 800px;">
  　この課題は終了です。<br>
    キーボードのキーをどれか押すと、結果が保存されて，次の課題に進みます<br>`,
  choices: "ALL_KEYS",
  post_trial_gap: 1000,
  data: {
    name: 'end'
  }
});

/**
 * 画面のフルスクリーン表示を解除します。
 * @returns ブロック定義
 */
const cancelFullScreen = () => ({
  type: jsPsychFullscreen,
  fullscreen_mode: false,
});

/////////////////////////////////////////////////
//// 関数の定義

/**
 * 設定情報を格納したオブジェクトを生成します。
 */
const prepareSettings = () => {

  let usersettings = getUserDefinedSettings();

  // 以下、ソースに関する設定をします。
  // パス名に '/' が不足していれば追加します。
  if (usersettings.sourceFolderPath.charAt(usersettings.sourceFolderPath.length - 1) !== '/') {
    usersettings.sourceFolderPath += '/';
  }

  // 画像ファイルのパスを格納するマップです。
  usersettings.stimSourceMap = new Map();
  // 画像ファイルのパスを設定します。
  for (let i = 0; i < usersettings.stimuli.length; i++) {
    usersettings.stimSourceMap.set(
      usersettings.stimuli[i].mouth, usersettings.sourceFolderPath + usersettings.stimuli[i].image
    );
  }

  // 課題パターン (pattern) を表すマップです。
  let patternMap = new Map();
  patternMap.set(1, { f: { mouth: 'short', frequent: true }, j: { mouth: 'long',  frequent: false } });
  patternMap.set(2, { f: { mouth: 'long',  frequent: true }, j: { mouth: 'short', frequent: false } });
  patternMap.set(3, { f: { mouth: 'short', frequent: false }, j: { mouth: 'long',  frequent: true } });
  patternMap.set(4, { f: { mouth: 'long',  frequent: false }, j: { mouth: 'short', frequent: true } });

  // 課題のパターンを取得します。
  if (usersettings.pattern != 0) {
    usersettings.taskPattern = patternMap.get(usersettings.pattern);
  } else {
    let number = getRandamNumber(1, 4);
    usersettings.taskPattern = patternMap.get(number);
  }

  // 口の長さに対応するキー ナビゲーションの表記を設定します。
  usersettings.keynaviMap = new Map();
  usersettings.keynaviMap.set('short', '<b>短い口</b>');
  usersettings.keynaviMap.set('long', '<b>長い口</b>');

  // 口の長さに対応するキーを取得します。
  usersettings.key_short = (usersettings.taskPattern.f.mouth == 'short') ? 'f' : 'j';
  usersettings.key_long = (usersettings.taskPattern.f.mouth == 'long') ? 'f' : 'j';

  // 使用しないユーザー定義の設定を消去します。
  delete usersettings.sourceFolderPath;
  delete usersettings.stimuli;

  return usersettings;
};

/**
 * 口の短い顔 ('short') と口の長い顔 ('long') がランダムに格納された配列を 3 つ生成します。
 * 配列の長さは 100 回 × 3 試行 = 300 です。
 * 1 試行あたり、口の短い顔と、口の長い顔がそれぞれ 50 個含まれます。
 * 同一の顔は続けて 3 回以上連続することはありません。
 * 画像と一緒に
 * correct_key: 正しいキーの種類 ('f' または 'j')
 * reward: 報酬の対象となる試行 (true または false)
 * を合わせて設定します。
 * frequent である顔は、60% (30 回) が reward の対象です。
 * infrequent である顔は、20% (10 回) が reward の対象です。
 */
const generateStimulusPattern = (settings) => {
  // 画像を定数に格納します。
  const imageF = settings.stimSourceMap.get(settings.taskPattern.f.mouth);
  const imageJ = settings.stimSourceMap.get(settings.taskPattern.j.mouth);

  // 100 試行分の刺激を生成します。
  const pattern = () => {
    // frequent 刺激の設定をします。
    let frequent = [];
    // frequent 刺激の reward の場合の設定をします。
    for (let i = 0; i < 30; i++) {
      if (settings.taskPattern.f.frequent) {
        frequent.push( { stimulus : imageF, correct_key: 'f', frequency: 'frequent', reward: true } );
      } else {
        frequent.push( { stimulus : imageJ, correct_key: 'j', frequency: 'frequent', reward: true } );
      }
    }
    // frequent 刺激の reward でない場合の設定をします。
    for (let i = 0; i < 20; i++) {
      if (settings.taskPattern.f.frequent) {
        frequent.push( { stimulus : imageF, correct_key: 'f', frequency: 'frequent', reward: false } );
      } else {
        frequent.push( { stimulus : imageJ, correct_key: 'j', frequency: 'frequent', reward: false } );
      }
    }

    // infrequent 刺激の設定をします。
    let infrequent = [];
    // infrequent 刺激の reward の場合の設定をします。
    for (let i = 0; i < 10; i++) {
      if (settings.taskPattern.f.frequent) {
        infrequent.push( { stimulus : imageJ, correct_key: 'j', frequency: 'infrequent', reward: true } );
      } else {
        infrequent.push( { stimulus : imageF, correct_key: 'f', frequency: 'infrequent', reward: true } );
      }
    }
    // infrequent 刺激の reward でない場合の設定をします。
    for (let i = 0; i < 40; i++) {
      if (settings.taskPattern.f.frequent) {
        infrequent.push( { stimulus : imageJ, correct_key: 'j', frequency: 'infrequent', reward: false } );
      } else {
        infrequent.push( { stimulus : imageF, correct_key: 'f', frequency: 'infrequent', reward: false } );
      }
    }

    // 配列をシャッフルします。
    let shuffledFrequent = jsPsych.randomization.shuffle(frequent);
    let shuffledInfrequent = jsPsych.randomization.shuffle(infrequent);

    // 以下、frequent および infrequent 刺激が 1 または 2 個おきに表示されるように設定します。
    // 1 または 2 を要素とし、これらが並んだ配列 (countArray_50) を作成します。
    // これらの要素数の和が 50 となるように、1 および 2 を等確率でランダムに選択します。
    // countArray_50 をシャッフルした配列を 2 つ用意し、それぞれの要素を交互に追加した新たな配列を作成します (countArray、要素数の和は 100)。
    // 新たに作成した配列の要素を frequent または infrequent の要素数として交互に取り出します。

    // countArray を作成します。
    let sum = 0;
    let countArray_50 = [];
    while (sum <= 50) {
      let element = getRandamNumber(1, 2);
      countArray_50.push(element);
      sum += element;
      if (sum == 49) {
        countArray_50.push(1);
        sum += 1;
      }
    }
    let countArray_50_1 = jsPsych.randomization.shuffle(countArray_50);
    let countArray_50_2 = jsPsych.randomization.shuffle(countArray_50);
    let countArray = [];
    for (let i = 0; i < countArray_50.length; i++) {
      countArray.push(countArray_50_1[i]);
      countArray.push(countArray_50_2[i]);
    }

    // frequent および infrequent のどちらの刺激を先に表示するかを決定します。
    let order = jsPsych.randomization.sampleWithoutReplacement([shuffledFrequent, shuffledInfrequent], 2);

    // 刺激を格納する配列を作成します。
    let pattern = [];

    // 刺激を順番に格納します。
    let order0_count = 0;
    let order1_count = 0;
    for (let i = 0; i < countArray.length; i++) {
      let length = countArray[i];
      if ((i % 2) == 0) {
        pattern.push(...(order[0].slice(order0_count, order0_count + length)));
        order0_count += length;
      } else {
        pattern.push(...(order[1].slice(order1_count, order1_count + length)));
        order1_count += length;
      }
    }
    return pattern;
  };

  // 刺激パターンを格納する配列です。
  let stimulusPattern = [];

  // 300 回分 (100 回 × 3) の刺激を生成します。
  for (let i = 0; i < 3; i++) {
    stimulusPattern.push(pattern());
  }

  // 配列を平坦化し、試行回数をプロパティに設定します。
  stimulusPattern = stimulusPattern.flat();
  for (let i = 0; i < stimulusPattern.length; i++) {
    stimulusPattern[i].trial_count = i + 1;
  }

  // testPattern(stimulusPattern); 刺激パターンのテストです。

  return stimulusPattern;
};

/**
 * min と max の間のランダムな数値を取得します。
 * 両端の 2 つの値を含みます。
 */
 const getRandamNumber = (min, max) => {
  let minValue = Math.ceil(min);
  let maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
};

/**
 * 10 msec 単位で時間をカウントダウンするタイマーを表示します。
 */
 const countDown = (settings) => {
  // タイマーの動作開始時刻を取得します。
  let startTime = performance.now();

  // stopwatch に一致する要素を表すオブジェクトを取得します。
  const stopwatch = document.getElementById('stopwatch');

  // タイマーの ID です。
  let timeoutid;

  // 設定時間だけタイマーを表示します。
  timeoutid = setInterval( () => {
    let remainTime = settings.breakTimeDuration - (performance.now() - startTime); // 残り時間 (msec) です。
    let sec = Math.floor(remainTime / 1000);
    let msec = Math.floor((remainTime - sec * 1000) / 10);
    let secString = sec.toString().padStart(2, '0');
    let msecString = msec.toString().padStart(2, '0');
    stopwatch.textContent = `${secString}:${msecString}`;

    // 残り時間が 0 になったら、タイマーをリセットします。
    if (remainTime < 0) {
      stopwatch.textContent = `00:00`;
      clearInterval(timeoutid);
    }
  }, 10)
};

////////////////////////////////////////
//// テスト

/**
 * 刺激パターンが適切に作成されたかを確認します。
 */
const testPattern = (stimulusPattern) => {
  let countFrequent = 0;
  let countInfrequent = 0;
  let countFrequentReward = 0;
  let countInfrequentReward = 0;
  stimulusPattern.forEach(element => {
    element.frequency == 'frequent' ? countFrequent++ : null;
    element.frequency == 'infrequent' ? countInfrequent++ : null;
    ((element.frequency == 'frequent') && element.reward) ? countFrequentReward++ : null;
    ((element.frequency == 'infrequent') && element.reward) ? countInfrequentReward++ : null;
  });
  console.log(stimulusPattern.length == 100*3);    // 刺激パターンの個数を確認します。
  console.log(countFrequent == 50*3);              // frequent 刺激の個数を確認します。
  console.log(countInfrequent == 50*3);            // infrequent 刺激の個数を確認します。
  console.log(countFrequentReward == 50*0.6*3);    // frequent 刺激の内、reward の個数を確認します。
  console.log(countInfrequentReward == 50*0.2*3);  // infrequent 刺激の内、reward の個数を確認します。
};

////////////////////////////////////////
//// 課題の実行

/**
 * 課題シーケンスです。
 * timeline 変数をグローバルに定義することにより、
 * jsPsych が定義された課題シーケンスを実行します。
 */
var timeline = prepareTimeline();
