// URL da lista M3U
const m3uUrl = 'https://raw.githubusercontent.com/JairPPereira/tvweb/main/jpiptv/playtv.m3u';

// Função para carregar a lista M3U
async function loadM3U() {
    try {
        const response = await fetch(m3uUrl);
        const text = await response.text();
        parseM3U(text);
    } catch (error) {
        console.error('Erro ao carregar a lista M3U:', error);
    }
}

// Função para analisar a lista M3U e criar grupos e canais
function parseM3U(data) {
    const lines = data.split('\n');
    const groups = {};
    let currentGroup = 'Geral';
    
    lines.forEach((line, index) => {
        if (line.startsWith('#EXTINF:')) {
            const parts = line.split(',');
            const name = parts[1].trim();
            const url = lines[index + 1].trim();
            
            // Extrair o grupo do atributo `group-title`
            const groupMatch = line.match(/group-title="([^"]*)"/);
            const group = groupMatch ? groupMatch[1] : 'Geral';
            
            if (!groups[group]) groups[group] = [];
            groups[group].push({ name, url });
        }
    });
    
    displayGroups(groups);
}

// Função para exibir grupos na página
function displayGroups(groups) {
    const groupsContainer = document.getElementById('groups');
    groupsContainer.innerHTML = '';  // Limpa o conteúdo anterior
    const groupKeys = Object.keys(groups);
    
    if (groupKeys.length === 0) {
        groupsContainer.innerHTML = 'Nenhum grupo encontrado.';
    } else {
        groupKeys.forEach(group => {
            const button = document.createElement('button');
            button.textContent = group;
            button.onclick = () => displayChannels(groups[group]);
            groupsContainer.appendChild(button);
        });
    }
}

// Função para exibir canais ao lado
function displayChannels(channels) {
    const channelsContainer = document.getElementById('channels');
    channelsContainer.innerHTML = '';  // Limpa o conteúdo anterior
    if (channels.length === 0) {
        channelsContainer.innerHTML = 'Nenhum canal encontrado.';
    } else {
        channels.forEach(channel => {
            const item = document.createElement('div');
            item.textContent = channel.name;
            item.onclick = () => playChannel(channel.url);
            channelsContainer.appendChild(item);
        });
    }
}

// Função para reproduzir um canal
function playChannel(url) {
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = url;
    videoPlayer.play();
}

// Carregar a lista M3U ao abrir a página
window.onload = loadM3U;
