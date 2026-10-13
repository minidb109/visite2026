import { game } from "./game.js";
const seals = {
    a1:'○',
    a2:'□',
    a3:'◇',
    a4:'☆',
    a5:'△',
    a6:'⬡' 
};

const initModal = document.getElementById("init-modal");
const lossModal = document.getElementById("loss-modal");

initModal.classList.add("exib-modal");
document.getElementById("start").addEventListener("click", () => {
    initModal.classList.remove("exib-modal");
    game.start();
});

document.querySelectorAll(".restart").forEach(btn => btn.addEventListener("click", () => {
    location.reload();
}));

(function () {
    const width = 960, height = 480;
    const cube = document.querySelector('.cube');
    const faces = document.querySelectorAll('.face');
    const moveReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let spin = 0;          // contador que só cresce ou diminui de 1 em 1
    let spining = false;   // true enquanto a animação roda

    // Face visível, de 1 a 4. O "+4 ... %4" evita resultado negativo quando giro < 0.
    function currentFace() {
        return (((spin % 4) + 4) % 4) + 1;
    }


    function markCurrentFace() {
        const f = currentFace();
        faces.forEach(el => el.classList.toggle('ativa', Number(el.dataset.face) === f));
    }

    function completeSpin() {
        spining = false;
        document.body.classList.remove('girando');
        markCurrentFace();       // só agora a nova face passa a aceitar cliques
    }

    function goToFace(destiny) {            // destino: 1 a 4
        if (spining) return;                    // ignora pedidos durante a animação
        if (game && game.status !== 'playing') return;   // só navega com o jogo rodando

        let difference = destiny - currentFace();  // vai de -3 a 3
        if (difference === 0) return;            // já está nessa face
        if (difference === 3) difference = -1;   // 1 -> 4: um passo para trás, não três para frente
        if (difference === -3) difference = 1;    // 4 -> 1: um passo para frente
        // diferença 2 ou -2: tanto faz o lado, gira duas faces

        spin += difference;
        spining = true;
        document.body.classList.add('girando');

        faces.forEach(el => el.classList.remove('ativa'));   // ninguém clica durante o giro
        if (game) game.face = currentFace();
        cube.style.setProperty('--giro', spin);              // aqui o CSS faz o cubo girar

        if (moveReduce) {
            completeSpin();                       // sem animação não existe "fim da transição"
        } else {
            const spinThisOrder = spin;         // garantia caso o aviso de fim da animação não chegue
            setTimeout(() => {
                if (spining && spin === spinThisOrder) completeSpin();
            }, 1000);
        }
    }

    // O navegador avisa quando a animação termina
    cube.addEventListener('transitionend', (e) => {
        if (e.target === cube && e.propertyName === 'transform') completeSpin();
    });

    // Atalhos de "próxima" e "anterior", com volta circular
    function next() { goToFace((currentFace() % 4) + 1); }        // 1→2→3→4→1
    function previous() { goToFace(((currentFace() + 2) % 4) + 1); }  // 1→4→3→2→1

    document.addEventListener("game:change", () => {
        document.body.dataset.status = game.status
        document.getElementById('final').classList.toggle('locked', !game.isFinalUnlocked());

        //timer
        const watch = document.getElementById("watch");
        const remaining = new Date(game.remaining);
        watch.innerText = remaining.toLocaleTimeString("pt-BR", { minute: "2-digit", second: "2-digit" });
        if (game.redAlert) {
            watch.classList.add("red-alert");
        }

        //reconhece derrota
        if(game.status === "lost"){
            lossModal.classList.add("exib-modal");
        }

        if(game.status === "lost" || game.status === "won"){
            document.activeElement.blur();
        }
        
        for(const puzzle in game.solved){
            if(game.solved[puzzle]){
                document.getElementById(puzzle).classList.add("resolved");
                const seal = document.getElementById("seal-" + puzzle);
                if (seal) seal.innerText = seals[puzzle];
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;   // setas dentro de um campo não giram o cubo
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') previous();
    });

    // Setas do mouse: registro único (goToFace só navega com jogo em 'playing')
    document.getElementById('arrow-left').addEventListener('click', previous);
    document.getElementById('arrow-right').addEventListener('click', next);

    // Ajusta o tamanho do cubo à janela (140px reservados para as setas)
    function ajustScale() {
        const scale = Math.min((innerWidth - 140) / (width + 40), (innerHeight - 140) / (height + 40));
        document.documentElement.style.setProperty('--scale', scale);
    }
    window.addEventListener('resize', ajustScale);

    // Estado inicial
    ajustScale();
    markCurrentFace();
})();