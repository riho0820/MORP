// スクロールをきっかけにアニメーションさせるプラグインを登録
gsap.registerPlugin(ScrollTrigger);

// Web フォントの読み込みをする
WebFont.load({
  // 自分のフォントファイルを読み込んでる
  custom: {
    families: ["MORP:n4"],
    urls: ["css/fonts.css"],
  },
  google: {
    families: ["Quicksand:700"],
  },
  active: () => {
    // 全てのフォントが読み込み終わったらこの中が実行される
    sessionStorage.fonts = true;

    // Sample1: ループアニメーション
    new MORP("h1");
    new MORP(".js-morp");

    // Sample2: スクロールアニメーション
    const coverTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#js-cover",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        // markers: true,
      },
    });

    coverTl.fromTo(
      ".js-cover-char",
      {
        "--morp": 0,
      },
      {
        "--morp": 1000,
        ease: Power2.easeOut,
      }
    );

    // Sample3: トリガーアニメーション
    const morp = new MORP("#js-try-char", {
      delay: 0.0, // タイムラインがはじまるまでに遅延させる時間
      fadeOut: {
        delay: 0.0, // フェードアウトがはじまるまでの時間
      },
      fontFamily: "Quicksand",
      fontVariationSettings: "normal",
      morph: {
        delay: 0.0, // モーフィングがはじまるまでの時間
      },
      oneWay: true,
      repeat: 0,
      scrollTrigger: {
        trigger: "#js-try-char",
        start: "top 80%",
        once: true,
      },
    });
  },
});
