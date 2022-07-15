"use strict";
import finishGame from "./finish.js";

const canvas = document.getElementById('canvas'); // canvas要素を取得 
const context = canvas.getContext('2d');          // 絵を描く部品を取得
canvas.style.border = "2px solid";  // canvasに枠線をつける
let timer;

// ゲーム時間（スコア）を表示する displayTime 関数
const displayTime = () => {
    gameTime += 1;
    const txt = document.getElementById("score_text");   // データを表示するdiv要素の取得
    txt.innerHTML = "　Score: " + gameTime;
}

// プレイヤを表示する drawPlayer 関数
const drawPlayer = () => {
    const os = navigator.platform;                // OS名の取得
    if(os === "iPhone" || os === "iPad" || os === "iPod") {     // iOSなら
        aX *= -1;                               // 加速度の正負を反転させる
        aY *= -1;                               // a *= b は a = a * b の意味
        aZ *= -1;
    }
    player.sx += 0.2 * aX;                      // ★x方向に加速（係数はテキトー）
    player.sy += 0.2 * aY;                      // ★y方向に加速（係数はテキトー）
    player.x -= player.sp * aX + player.sx;     // ★プレイヤのx座標を更新（加速付き）
    player.y += player.sp * aY + player.sy;     // ★プレイヤのy座標を更新（加速付き）
    if(player.x < 0) {                          // xが0未満なら
        player.x = 0;                               // xを0にする（それより左に行かない）
        player.sx = 0;                              // ★x方向の加速を0にする
    } else if(player.x > canvas.width) {        // xがcanvasの幅以上なら
        player.x = canvas.width;                    // xをcanvasの幅の値にする（それより右に行かない）
        player.sx = 0;                              // ★x方向の加速を0にする
    }
    if(player.y < 0) {                          // yが0未満なら
        player.y = 0;                               // yを0にする（それより上に行かない）
        player.sx = 0;                              // ★y方向の加速を0にする
    } else if(player.y > canvas.height) {       // yがcanvasの高さ以上なら
        player.y = canvas.height;                   // yをcanvasの高さの値にする（それより下に行かない）
        player.sx = 0;                              // ★y方向の加速を0にする
    }
    context.clearRect(0, 0, canvas.width, canvas.height);   // canvasの内容を消す clearRect(x, y, w, h)
    context.beginPath();                        // 描画開始
    // context.arc(player.x, player.y, player.radius,  // 円を描く arc(x, y, 半径, 開始角度, 終了角度)
    //             0, 2 * Math.PI);                // 角度の単位はラジアン（2π = 360度）で指定
    // context.fillStyle = player.color            // 塗りつぶす色の設定
    // context.fill();                             // 塗る
    img.src = "./img/player.png";
    context.drawImage(img, player.x - player.radius, player.y - player.radius, player.radius*2, player.radius*2);
}

// 隕石を生成する generateMeteo 関数
const generateMeteo = () => {
    for(let i = 0; i < meteo.length; i++) {     // 全ての隕石について
        meteo[i] = new Ball();                  // MeteoBall クラスのインスタンスとして初期化
        meteo[i].x = i * canvas.width / meteoNum + (canvas.width / meteoNum / 2);   // 隕石の横方向の位置
        meteo[i].color = "rgb(0, 0, 0)";        // 隕石の色
        randomizeMeteo(meteo[i])                // それ以外のプロパティはランダムに決める
    }
}

// 隕石のプロパティをランダムに決める randomizeMeteo 関数
const randomizeMeteo = (obj) => {
    obj.y = Math.random() * (0 + canvas.height) - canvas.height;            // 隕石のy座標
    obj.radius = Math.random() * (canvas.width / meteoNum / 2 - 10) + 10;   // 隕石の半径
    obj.sp = Math.random() * (15 - 1) + 1;                                  // 隕石の速さ
}

// 隕石を描画する drawMeteo 関数
const drawMeteo = () => {
    for(let i = 0; i < meteo.length; i++) {     // 全ての隕石について
        meteo[i].y += meteo[i].sp;              // それぞれのスピードで動かす
        if(collision(player, meteo[i]) === true) {  // 衝突判定結果がtrueなら
            clearInterval(timer);            // タイマーを止める
            finishGame(gameTime);
        }
        if(meteo[i].y > canvas.height + meteo[i].radius) {  // もし隕石が画面から消えたら
            randomizeMeteo(meteo[i]);           // 位置やサイズを初期化・ランダム化する
        }
        context.beginPath();                    // 描画開始
        // context.arc(meteo[i].x, meteo[i].y, meteo[i].radius,  // 円を描く arc(x, y, 半径, 開始角度, 終了角度)
        //             0, 2 * Math.PI);            // 角度の単位はラジアン（2π = 360度）で指定
        // context.fillStyle = meteo[i].color      // 塗りつぶす色の設定
        // context.fill();                         // 塗る
        // img.src = img_list[0];
        const img_meteo = new Image();
        img_meteo.src = img_list[i % 3];
        context.drawImage(img_meteo, meteo[i].x-meteo[i].radius, meteo[i].y-meteo[i].radius, meteo[i].radius*2, meteo[i].radius*2);
    }
}

// プレイヤ(obj1)と隕石(obj2)の衝突判定を行う collision 関数（true/false を返す）
const collision = (obj1, obj2) => {
    var distanceX = obj1.x - obj2.x;            // プレイヤと各隕石の中心の横方向の距離
    var distanceY = obj1.y - obj2.y;            // プレイヤと各隕石の中心の縦方向の距離
    var distance  = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)); // プレイヤと隕石の中心の直線距離
    if(distance < (obj1.radius + obj2.radius)) {    // 直線距離がプレイヤの半径と隕石の半径の和より小さければ
        return true;                            // 衝突(true)を返す
    } else {                                    // そうでなければ
        return false;                           // falseを返す
    }
}

const GameStart = () => {
    gameTime = 0;
    aX = 0;
    aY = 0;
    aZ = 0; 
    meteo = new Array(meteoNum);
    generateMeteo();
    // 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
    timer = setInterval(() => {
        displayTime();      // displayTime 関数を実行
        drawPlayer();       // drawPlayer 関数を実行
        drawMeteo();        // drawMeteo 関数を実行
    }, 33); // 33msごとに（1秒間に約30回）
}


// ボールをクラス化
class Ball {
    constructor() {                             // コンストラクタ（宣言した時に実行される関数）の定義
        this.x = canvas.width / 2;                           // x座標の初期値
        this.y = canvas.height / 2;                           // y座標の初期値
        this.radius = 30;                       // 半径の初期値
        this.color = "rgb(0, 0, 255)";          // 色の初期値
        this.sp = 3;                            // 速さの係数
        this.sx = 0;                            // ★x方向の加速
        this.sy = 0;                            // ★y方向の加速
    }
}


// 画像の読み込み
const img = new Image();
img.src = "./img/busu.png";

const player = new Ball();                        // Ballクラスのインスタンス player を宣言
let aX = 0, aY = 0, aZ = 0;                     // 加速度の値を入れる変数を3個用意


const img_list = ["./img/homework.png", "./img/job.png", "./img/morning.png"]
const meteoNum = 7;                               // 隕石の数
let meteo = new Array(meteoNum);                // 隕石の配列を宣言
generateMeteo();                                // 隕石を生成する generateEnemies を実行

let gameTime = 0;                               // ゲーム時間（スコア）

// 加速度センサの値が変化したら実行される devicemotion イベント
// 加速度センサの使用が許可されているかの確認（許可されていない場合はボタンを表示する）
if (window.DeviceOrientationEvent) {
    if (DeviceOrientationEvent.requestPermission && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const banner = '<div id="sensorrequest" onclick="ClickRequestDeviceSensor();"><div class="d-grid container mt-4"><div class="btn btn-warning">センサーの有効化</div></div>';
        $('body').prepend(banner);
    } else {
        window.addEventListener("devicemotion", (dat) => {
            aX = dat.accelerationIncludingGravity.x;    // x軸の重力加速度（Android と iOSでは正負が逆）
            aY = dat.accelerationIncludingGravity.y;    // y軸の重力加速度（Android と iOSでは正負が逆）
            aZ = dat.accelerationIncludingGravity.z;    // z軸の重力加速度（Android と iOSでは正負が逆）
        });
    }
}


// ユーザーにセンサを使用する「許可」ボタンを押したときの処理
const ClickRequestDeviceSensor = () => {
    // $("#retMessage").empty();


    // デバイスの重力加速度の取得が許可されたときの処理
    DeviceMotionEvent.requestPermission().then(function(response) {
        if (response === 'granted') {
            window.addEventListener("devicemotion", (dat) => {
                aX = dat.accelerationIncludingGravity.x;    // x軸の重力加速度（Android と iOSでは正負が逆）
                aY = dat.accelerationIncludingGravity.y;    // y軸の重力加速度（Android と iOSでは正負が逆）
                aZ = dat.accelerationIncludingGravity.z;    // z軸の重力加速度（Android と iOSでは正負が逆）
            });
        }
    }).catch(function(e) {
        console.log(e);
    });
}

export default GameStart;