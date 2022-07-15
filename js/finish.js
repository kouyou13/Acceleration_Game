"use strict";
import GameStart from "./game.js";

const end_game_div = document.getElementById("end_game");
const game_menu_div = document.getElementById("game_menu");
const finish_score_text = document.getElementById("finish_score");
const restart_btn = document.getElementById("restart_btn");
const canvas = document.getElementById('canvas'); // canvas要素を取得 
const context = canvas.getContext('2d');          // 絵を描く部品を取得
const fin_img = document.getElementById("fin_random");

const finishGame = (score) => {
  finish_score_text.textContent = "Score：" + score;
  end_game_div.style.display = 'block';
  const random_num = Math.floor(Math.random() * 5) + 1; // 1~5の乱数（整数）
  fin_img.src = './img/fin_' + random_num + '.png';
  restart_btn.onclick = function(){
    const text =  "もう一度ゲームを始めますか？";
    // ダイアログを出していいえを選択したら…
    if (!confirm(text)) {
      // 処理を中断
      return false;
    }
    end_game_div.style.display = 'none';
    context.clearRect(0, 0, canvas.width, canvas.height);
    GameStart();
  }
}

export default finishGame;