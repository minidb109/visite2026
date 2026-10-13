const maxTime = 15 * 1000 * 60;
const redAlertTime = 5 * 1000 * 60;

export const game = {
    status: "idle",   // 'idle' | 'playing' | 'won' | 'lost'
    endsAt: null,     // hora de término em milissegundos; restante = endsAt - Date.now()
    remaining: null,
    maxTime,          // tempo total da partida em ms (só leitura para placar)
    redAlert: false,
    face: 1,          // face visível (1 a 4)
    solved: {
        a1: false,
        a2: false,
        a3: false,
        a4: false,
        a5: false,
        a6: false,
        final: false
    },
    interval: null,
    
    tick(){
        this.remaining = Math.max(-0.5, this.endsAt - (new Date()).getTime());
        this.redAlert = false;
    
        if(this.remaining < redAlertTime + 1000){
            this.redAlert = true;
        }
    
        if(this.remaining < 0){
            this.status = "lost";
            clearInterval(this.interval);
        }
        
        this.notify();
    },
    
    start(){
        if (this.status !== 'idle') return;
        this.status = "playing";
        this.endsAt = (new Date()).getTime() + maxTime;
        this.tick();
        this.interval = setInterval(() => this.tick(), 500);
        this.notify();
    },

    solve(puzzle){
        if(!(puzzle in this.solved)){
            console.log("Puzzle inexistente");
            return;
        }
        if(this.status != "playing"){
            console.log("O status do jogo precisa ser 'playing' para resolver um enigma");
            return;
        }
        if(this.solved[puzzle]){
            console.log("Enigma já resolvido");
            return;
        }
        if(puzzle !== "final"){
            this.solved[puzzle] = true;
            this.notify();
            return;
        }
        if(puzzle === "final"){
            if(!this.solved.a1 || !this.solved.a2 || !this.solved.a3 || !this.solved.a4 || !this.solved.a5 || !this.solved.a6){
                console.log("Não é possível resolver o enigma final sem resolver todos os outros enigmas antes");
                return;
            }
            this.status = "won";
            clearInterval(this.interval);
        }
        this.notify();
    },

    notify() {
        document.dispatchEvent(new CustomEvent('game:change'));
    },

    pending(){
        return ['a1','a2','a3','a4','a5','a6'].filter(id => !this.solved[id]).length;
    },
    
    isFinalUnlocked(){
        return this.pending() === 0;
    },

    isLocked(id){
        return this.status !== 'playing' || this.solved[id] || (id === 'final' && !this.isFinalUnlocked());
    },
};