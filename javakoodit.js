// Elementtien haku
const ikkuna = document.getElementById("ponnahdusikkuna");
const avaaBtn = document.querySelector(".lisaa");
const suljeBtn = document.querySelector(".sulje");
const tallennaBtn = document.getElementById("tallenna");
const kategoriavalinta = document.getElementById("kategoria");
const lisakentat = document.getElementById("lisakentat");
const kokonaisYhteensaDiv = document.getElementById("kokonais-yhteensa"); // HUOM: Tämän id:n oletetaan olevan HTML-tiedostossa

// Avaa ja sulje
avaaBtn.onclick = () => {
    ikkuna.style.display = "block";
};

suljeBtn.onclick = () => {
    ikkuna.style.display = "none";
};

// Lisäkenttien näyttäminen
kategoriavalinta.addEventListener("change", paivitalisakentat);

function paivitalisakentat() {
    const laji = kategoriavalinta.value;
    let html = "";

    if (laji === "juokseminen" || laji === "pyoraily") {
        html = `
            <label for="nopeus">Keskinopeus (km/h): </label><br>
            <input type="number" id="nopeus"><br><br>
        `;
    } else if (laji === "ratsastus") {
        html = `
            <label for="laji">Tyyli: </label><br>
            <select id="laji">
                <option>Kouluratsastus</option>
                <option>Esteratsastus</option>
                <option>Maastoesteratsastus</option>
                <option>Maasto</option>
            </select><br><br>   
        `;
    }
    lisakentat.innerHTML = html;
}

paivitalisakentat(); // Näytä lisäkentät heti

// Laskee ja päivittää kaikkien treenien kokonaisajan
function paivitaKokonaisYhteensaAika() {
    const treenit = JSON.parse(localStorage.getItem("treenit")) || [];
    
    // Lasketaan kaikkien treenien kestojen summa
    const kokonaisAikaMinuuteissa = treenit.reduce((summa, treeni) => summa + Number(treeni.kesto), 0);
    
    // Näytetään kaikkien treenien kokonaisaika
    if (kokonaisYhteensaDiv) {
        const tunnit = Math.floor(kokonaisAikaMinuuteissa / 60);
        const minuutit = kokonaisAikaMinuuteissa % 60;
        
        let tunnitTeksti = "";
        if (tunnit > 0) {
            tunnitTeksti = `${tunnit} t ${minuutit} min`;
        } else {
            tunnitTeksti = `${minuutit} min`;
        }
        
        kokonaisYhteensaDiv.innerHTML = `
            <h2>Kokonaisaika: <strong>${kokonaisAikaMinuuteissa} min</strong> (${tunnitTeksti})</h2>
        `;
    }
}

// Laskee ja päivittää yhteenlasketun treeniajan
function paivitaYhteensaAika() {
    const treenit = JSON.parse(localStorage.getItem("treenit")) || [];
    const lajit = ["sali", "juokseminen", "pyoraily", "ratsastus"];

    lajit.forEach(laji => {
        // Laskee yhteen kaikkien treenien kestot (minuutteina) tälle lajille
        const yhteensaAika = treenit
            .filter(t => t.laji === laji)
            .reduce((summa, treeni) => summa + Number(treeni.kesto), 0);
        
        const yhteensaSolu = document.getElementById(`${laji}-yhteensa`); // Etsitään taulun yhteenvetosolu
        
        if (yhteensaSolu) {
            yhteensaSolu.textContent = `Treeniaika yhteensä: ${yhteensaAika} min`;
        }
    });

    // Päivitetään kaikkien treenien kokonaisaika
    paivitaKokonaisYhteensaAika(); 
}

// Tallenna treeni taulukkoon
tallennaBtn.onclick = () => {
    const laji = kategoriavalinta.value;
    const paivamaaraInput = document.getElementById("paivamaara");
    const kestoInput = document.getElementById("kesto");
    const paivamaara = paivamaaraInput.value;
    const kesto = kestoInput.value;
    const lisatiedot = document.getElementById("lisatiedot").value;
    const nopeus = document.getElementById("nopeus")?.value || "";
    const ratsastustyyppi = document.getElementById("laji")?.value || "";

    //Kenttien tarkistus
    if (!paivamaara || !kesto) { //päivämäärä ja treenin kesto pakollinen
        alert("Lisää päivämäärä sekä treenin kesto!");
        if (!paivamaara) paivamaaraInput.style.border = "2px solid red"; //punaiset reunat virheelliselle kohdalle
        if (!kesto) kestoInput.style.border = "2px solid red"; //punaiset reunat virheelliselle kohdalle
        return;
    }
    // Poista punaiset reunat
    paivamaaraInput.style.border = "";
    kestoInput.style.border = "";


    if (isNaN(kesto) || Number(kesto) <= 0) { // Treeniajan täytyy olla enemmän kuin 0
        alert("Treeniajan täytyy olla positiivinen numero!");
        kestoInput.style.border = "2px solid red"; //punaiset reunat virheelliselle kohdalle
        return;
    }

    // Oikea taulukko
    const taulukko = document.querySelector(`table.${laji}`);
    const rivi = taulukko.insertRow(-1); 

    // Lisätään oikeat solut eri lajeille
    if (laji === "juokseminen" || laji === "pyoraily") {
        rivi.insertCell(0).textContent = paivamaara;
        rivi.insertCell(1).textContent = `${kesto} min`;
        rivi.insertCell(2).textContent = nopeus;
        rivi.insertCell(3).textContent = lisatiedot;
    } else if (laji === "sali") {
        rivi.insertCell(0).textContent = paivamaara;
        rivi.insertCell(1).textContent = `${kesto} min`;
        rivi.insertCell(2).textContent = lisatiedot;
    } else if (laji === "ratsastus") {
        rivi.insertCell(0).textContent = paivamaara;
        rivi.insertCell(1).textContent = `${kesto} min`;
        rivi.insertCell(2).textContent = ratsastustyyppi;
        rivi.insertCell(3).textContent = lisatiedot;
    }

    // Tyhjennetään kentät ja suljetaan ikkuna
    document.getElementById("paivamaara").value = "";
    document.getElementById("kesto").value = "";
    document.getElementById("lisatiedot").value = "";
    lisakentat.innerHTML = "";
    ikkuna.style.display = "none";

    // Luodaan treeniobjekti
    const treeni = {
        laji,
        paivamaara,
        kesto,
        nopeus,
        ratsastustyyppi,
        lisatiedot
    };

    // Lisätään tiedot localStorageen
    let treenit = JSON.parse(localStorage.getItem("treenit")) || [];
    treenit.push(treeni);
    localStorage.setItem("treenit", JSON.stringify(treenit));
    
    // Päivitetään yhteensä aika tallennuksen jälkeen
    paivitaYhteensaAika();
};

// Tietojen hakeminen localStoragesta
window.onload = () => {
    const treenit = JSON.parse(localStorage.getItem("treenit")) || [];

    treenit.forEach(treeni => {
        const taulukko = document.querySelector(`table.${treeni.laji}`);
        const rivi = taulukko.insertRow(-1);

        if (treeni.laji === "juokseminen" || treeni.laji === "pyoraily") {
            rivi.insertCell(0).textContent = treeni.paivamaara;
            rivi.insertCell(1).textContent = `${treeni.kesto} min`;
            rivi.insertCell(2).textContent = treeni.nopeus;
            rivi.insertCell(3).textContent = treeni.lisatiedot;
        } else if (treeni.laji === "sali") {
            rivi.insertCell(0).textContent = treeni.paivamaara;
            rivi.insertCell(1).textContent = `${treeni.kesto} min`;
            rivi.insertCell(2).textContent = treeni.lisatiedot;
        } else if (treeni.laji === "ratsastus") {
            rivi.insertCell(0).textContent = treeni.paivamaara;
            rivi.insertCell(1).textContent = `${treeni.kesto} min`;
            rivi.insertCell(2).textContent = treeni.ratsastustyyppi;
            rivi.insertCell(3).textContent = treeni.lisatiedot;
        }
    });

    // Lasketaan ja näytetään yhteensä aika sivun latautuessa
    paivitaYhteensaAika();
};