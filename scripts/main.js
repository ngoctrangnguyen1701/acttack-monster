const audio = {
  startGame: document.getElementById('start-game-audio'),
  alarm: document.getElementById('alarm-audio'),
  gameOver: document.getElementById('game-over-audio'),
  heal: document.getElementById('heal-audio'),
  monsterLaugh: document.getElementById('monster-laugh-audio'),
  punch: document.getElementById('punch-audio'),
  victory: document.getElementById('victory-audio'),
  victory2: document.getElementById('victory2-audio'),
}

const initialGame = {
  healthbarYou: 0,
  healthbarMonster: 0,
  healthbarProgressYou: 0,
  healthbarProgressMonster: 0,
  isStartGame: false,
  winner: '',
  isYourTurn: true,
  damageIndex: 0,
  healIndex: 0,
  isDamageYou: false,
  isDamageMonster: false,
  isHealYou: false,
  timeOfHeal: 3, //số lần hồi máu trong quá 3 lần

  isMute: false,
  isAlarm: false,
  youWin: 0,
  monsterWin: 0,
}

new Vue({
  el: '#app',
  data: {
    ...initialGame
  },
  computed: {
    monsterAttack: function(){
      //xét 1 giây sau, monster mới attack
      if(this.isStartGame && this.isYourTurn === false && !this.winner){
        setTimeout(()=>{
          console.log('monsterAttack');
          //nếu không phải lượt của You và chưa có người thắng
          this.damageIndex = this.randomNumber(5, 40)
          this.healthbarYou -= this.damageIndex

          this.isDamageMonster = false
          this.isDamageYou = true
          this.isHealYou = false
          this.setWinner()
        }, 1000)
      }
    },
  },
  methods: {
    startGame: function(){
      if(this.isStartGame && !this.winner){
        //khi trận đấu đang diễn ra chưa có người chiến thắng, bấm start game sẽ không có chiện gì xảy ra
        alert('The fighting is not finish yet!')
        return
      }
      this.healthbarYou = 100
      this.healthbarMonster = 100
      this.healthbarProgressYou = 100
      this.healthbarProgressMonster = 100
      this.isStartGame = true
      this.winner = ''
      this.isYourTurn = true
      this.damageIndex = 0
      this.healIndex = 0
      this.isDamageYou = false
      this.isDamageMonster = false
      this.isHealYou = false
      this.timeOfHeal = 3

      this.isAlarm = false
      //CONTROL AUDIO
      if(!this.isMute) audio.startGame.play()
    },
    attack: function(){
      if(!this.winner){ //nếu chưa có người thắng
        console.log('you attack')
        this.damageIndex = this.randomNumber(10, 20)
        this.healthbarMonster -= this.damageIndex

        this.isDamageMonster = true
        this.isDamageYou = false
        this.isHealYou = false
        this.setWinner()
      }
    },
    heal: function(){
      if(!this.winner){
        if(this.healthbarYou <= 60 && !this.winner && this.timeOfHeal !== 0){
          console.log('you heal')
          this.healIndex = this.randomNumber(20, 50)
          this.healthbarYou += this.healIndex
          this.healthbarProgressYou = this.healthbarYou
          this.isYourTurn = false
          //lượt You heal, monster vẫn sẽ attack

          this.isDamageMonster = false
          this.isDamageYou = false
          this.isHealYou = true
          this.timeOfHeal -= 1

          this.isAlarm = false 
          //chỉnh lại isAlarm = false khi hồi máu, 
          //để khi máu You bị Monster attack, tuột xuống dưới 20 sẽ báo động 1 lần nữa
          //CONTROL AUDIO
          if(!this.isMute) audio.heal.play()
        }
        else if(this.timeOfHeal === 0){
          alert('You can not heal anymore!')
        }
        else{
          alert('When health is below 60%, you can heal')
        }
      }
    },
    giveup: function(){
      //nếu bấm give up, Monster sẽ win
      this.winner = 'Monster'
      this.isStartGame = false
      this.monsterWin += 1

      //CONTROL AUDIO
      if(!this.isMute) {
        audio.gameOver.play()
        audio.monsterLaugh.play()
      }
    },
    randomNumber: function(min, max){
      return Math.floor(Math.random() * (max - min + 1) ) + min
    },
    setWinner: function(){
      if(this.isYourTurn){
        if(this.healthbarMonster <= 0 && this.isStartGame){
          this.winner = 'You'
          this.healthbarProgressMonster = 0
          this.isStartGame = false
          this.youWin += 1

          //CONTROL AUDIO
          if(!this.isMute) {
            audio.victory.play()
            audio.victory2.play()
          }
        }
        else{
          this.healthbarProgressMonster = this.healthbarMonster
          this.isYourTurn = false

          //CONTROL AUDIO
          if(!this.isMute) audio.punch.play()
        }
      }
      else{
        if(this.healthbarYou <= 0 && this.isStartGame){
          this.winner = 'Monster' //--> nếu máu của You dưới 0, Monster sẽ thắng, và ngược lại
          this.healthbarProgressYou = 0
          this.isStartGame = false
          this.monsterWin += 1

          //CONTROL AUDIO
          if(!this.isMute) {
            audio.gameOver.play()
            audio.monsterLaugh.play()
          }
        }
        else{
          this.healthbarProgressYou = this.healthbarYou
          this.isYourTurn = true

          if(!this.isMute) audio.punch.play()

          if(this.healthbarYou <= 30){
            //báo động khi máu của You dưới 30
            this.isAlarm = true
            //CONTROL AUDIO
            if(!this.isMute) audio.alarm.play()
          }
        }      
      }
    },
  }
})