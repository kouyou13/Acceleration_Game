"use strict";
import GameStart from "./game.js";


const start_menu_div = document.getElementById("start_menu");
const game_menu_div = document.getElementById("game_menu");
const end_game_div = document.getElementById("end_game");

const start_btn = document.getElementById("start_btn");
game_menu_div.style.display = "none";
end_game_div.style.display = "none";


const main = () => {
  start_menu_div.style.display = "none";
  game_menu_div.style.display = "block";
  GameStart();
}

start_btn.onclick = function(){
  const text =  "ゲームを始めますか？";
  // ダイアログを出していいえを選択したら…
  if (!confirm(text)) {
    // 処理を中断
    return false;
  }
  main();
}
