class MORP {
  constructor(targets, vars = {}) {
    const defaults = {
      delay: 1.0, // タイムラインがはじまるまでに遅延させる時間
      duration: 0.6, // フェードイン・アウトにかかる時間
      fadeOut: {
        delay: 2.0, // フェードアウトがはじまるまでの時間
      },
      fontFamily: "MORP",
      fontVariationSettings: `'morp' var(--morp)`,
      morph: {
        delay: 2.0, // モーフィングがはじまるまでの時間
      },
      oneWay: false,
      repeat: -1, // タイムラインのリピート
      repeatDelay: 1.0, // タイムラインをリピートするときの間隔
      repeatRefresh: true,
      stagger: 0.1, // アニメーションが始まる間隔の時間
    };

    this.assets = [];
    this.options = { ...defaults, ...vars };
    this.splitText = new SplitText(targets, { type: "chars" });
    this.tl = gsap.timeline(this.options);

    this.splitText.chars.forEach((char) => {
      const computedStyle = getComputedStyle(char);
      // 元の文字と置き変える要素を作る
      const far = document.createElement("span");
      // 元の文字に重ねる span 要素（アイコン）を作る
      const nia = document.createElement("span");
      const niaChar = document.createElement("span");

      // 作った span 要素に文字列を指定する
      far.innerText = char.innerText;
      niaChar.innerText = char.innerText;

      // 作った span 要素の class 属性を設定する
      far.classList.add("js-morp-for");
      nia.classList.add("js-morp-nia");
      nia.classList.add("js-morp-nia_Char");

      // 元の文字と置き変える span 要素のスタイルを設定する
      far.style.display = "inline-block";

      // 元の文字に重ねる span 要素（アイコン）のスタイルを設定する
      // 元の文字の後ろに不可視で配置する
      nia.style.display = "inline-block";
      nia.style.left = "50%";
      nia.style.opacity = "0";
      nia.style.position = "absolute";
      nia.style.top = "50%";
      nia.style.transform = "translate(-50%, -50%)";
      nia.style.transformOrigin = "center";
      nia.style.userSelect = "none";
      nia.style.visibility = "hidden";
      nia.style.zIndex = "0";

      niaChar.style.display = "inline-block";
      niaChar.style.fontFamily = this.options.fontFamily;
      niaChar.style.fontWeight = "400";
      niaChar.style.fontVariationSettings = this.options.fontVariationSettings;
      niaChar.style.lineHeight = "1";
      niaChar.style.transform = "scale(1.0)";
      niaChar.style.transformOrigin = "center";

      // 元の文字を削除する
      char.innerHTML = "";

      // appendChild を使って入れ子にして、以下の状態にする
      // <span class="js-morp-nia">
      //   <span class="js-morp-nia_Char">X</span>
      // </span>
      nia.appendChild(niaChar);

      // 作った span 要素を HTML に追加する
      char.appendChild(far);
      char.appendChild(nia);

      // 作成した要素を配列に保持しておく
      this.assets.push({
        far,
        nia,
        width: () => {
          const fontSize = parseFloat(
            computedStyle.getPropertyValue("font-size")
          );
          const niaDOMRect = niaChar.getBoundingClientRect();

          return `${niaDOMRect.width / fontSize}em`;
        },
      });
    });

    this.assets.forEach(({ far, nia, width }, i) => {
      // 文字のフェードアウト
      this.tl.to(
        far,
        {
          autoAlpha: 0,
          duration: this.options.duration,
          ease: Power2.easeOut,
          width,
        },
        `sequence0+=${this.options.stagger * i}`
      );

      // アイコンのフェードイン
      this.tl.to(
        nia,
        {
          autoAlpha: 1,
          duration: this.options.duration,
          ease: Power2.easeIn,
        },
        `sequence0+=${this.options.stagger * i}`
      );

      // アイコンのモーフィング
      this.tl.fromTo(
        nia,
        {
          "--morp": 0,
        },
        {
          "--morp": 1000,
          duration: 1,
          ease: Power2.easeOut,
        },
        `sequence0+=${
          this.options.stagger * i +
          this.options.duration +
          this.options.morph.delay
        }`
      );

      if (!this.options.oneWay) {
        // アイコンのフェードアウト
        this.tl.to(
          nia,
          {
            autoAlpha: 0,
            duration: this.options.duration,
            ease: Power2.easeOut,
          },
          `sequence0+=${
            this.options.stagger * i +
            this.options.duration +
            this.options.morph.delay +
            this.options.fadeOut.delay
          }`
        );

        // 文字のフェードイン
        this.tl.to(
          far,
          {
            autoAlpha: 1,
            duration: 0.6,
            ease: Power2.easeIn,
            width: "auto",
          },
          `sequence0+=${
            this.options.stagger * i +
            this.options.duration +
            this.options.morph.delay +
            this.options.fadeOut.delay
          }`
        );
      }
    });
  }
}
