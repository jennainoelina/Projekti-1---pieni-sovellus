// Elementtien haku
const ikkuna = document.getElementById("ponnahdusikkuna");
const avaaBtn = document.querySelector(".lisaa");
const suljeBtn = document.querySelector(".sulje");
const tallennaBtn = document.getElementById("tallenna");
const kategoriavalinta = document.getElementById("kategoria");
const lisakentat = document.getElementById("lisakentat");

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

// Tallenna treeni taulukkoon
tallennaBtn.onclick = () => {
    const laji = kategoriavalinta.value;
    const paivamaara = document.getElementById("paivamaara").value;
    const kesto = document.getElementById("kesto").value;
    const lisatiedot = document.getElementById("lisatiedot").value;
    const nopeus = document.getElementById("nopeus")?.value || "";
    const ratsastustyyppi = document.getElementById("laji")?.value || "";

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
};
