// --- INTERFACE & MENU ---

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
        });
    });
});

// --- LÓGICA DE DADOS (CSV) ---

const DATA_SOURCE_URL = (typeof window !== 'undefined' && window.SPREADSHEET_URL) 
    ? window.SPREADSHEET_URL 
    : 'exemplo.csv';

function parseCSVRow(row) {
    const matches = row.match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g);
    if (!matches) return [];
    return matches.map(m => m.trim().replace(/^"|"$/g, '').trim());
}

async function fetchCorridas() {
    try {
        const response = await fetch(DATA_SOURCE_URL);
        if (!response.ok) {
            throw new Error(`Falha na requisição: ${response.status}`);
        }
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        return rows.map(row => {
            const cols = parseCSVRow(row);
            return {
                nome: cols[0] || 'Evento não nomeado',
                data: cols[1] || 'A definir',
                horario: cols[2] || '--:--',
                local: cols[3] || 'Local a definir',
                distancia: cols[4] || 'N/A',
                status: cols[5] || 'Desconhecido',
                link: cols[6] || ''
            };
        }).filter(c => c.nome !== 'Evento não nomeado'); 
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        return [];
    }
}

function getStatusBadgeClass(status) {
    const s = status.toLowerCase().trim();
    if (s === 'aberto') return 'badge-aberto';
    if (s === 'fechado') return 'badge-fechado';
    if (s === 'realizado') return 'badge-realizado';
    if (s === 'cancelado') return 'badge-cancelado';
    if (s === 'em breve') return 'badge-breve';
    return 'badge-default';
}

// --- ROTAS E CONTEÚDO ---

const routes = {
    '#home': () => `
        <div class="hero">
            <h1>Associação de Corredores</h1>
            <p>Unindo paixão, saúde e esporte nas ruas e trilhas da nossa região.</p>
            <br>
            <a href="#corridas" class="btn">Ver Calendário de Corridas</i></a>
        </div>
        <section class="features-section">
            <h2 class="section-title text-center">Por que treinar conosco?</h2>
            <div class="grid">
                <div class="card text-center">
                    <i data-lucide="users" class="icon-lg"></i>
                    <h3>Comunidade Ativa</h3>
                    <p>Faça parte de um grupo unido que se apoia em cada quilômetro, transformando treinos em momentos de lazer.</p>
                </div>
                <div class="card text-center">
                    <i data-lucide="map" class="icon-lg"></i>
                    <h3>Rotas Diversificadas</h3>
                    <p>Explore as melhores trilhas e trajetos urbanos de Ouro Branco com quem conhece a região.</p>
                </div>
                <div class="card text-center">
                    <i data-lucide="award" class="icon-lg"></i>
                    <h3>Suporte em Provas</h3>
                    <p>Organizamos logísticas para competições regionais e estaduais, garantindo que você foque apenas na sua performance.</p>
                </div>
            </div>
        </section>
    `,

    '#contato': () => `
        <div class="hero">
            <h2>Fale Conosco</h2>
            <p>Dúvidas sobre filiação ou próximos treinos? Estamos à disposição!</p>
            <br>
            <a href="https://wa.me/5531999999999" target="_blank" class="btn">
                Enviar WhatsApp <i data-lucide="message-circle"></i>
            </a>
        </div>
    `,

    '#corridas': async () => {
        const lista = await fetchCorridas();
        
        if (lista.length === 0) {
            return `<h2>Calendário de Corridas</h2><p>Nenhuma corrida encontrada no momento.</p>`;
        }

        let html = '<h2>Calendário de Corridas</h2><div class="grid">';
        
        lista.forEach(c => {
            const badgeClass = getStatusBadgeClass(c.status);
            const isAberto = c.status.toLowerCase().trim() === 'aberto';
            
            const btnHtml = isAberto && c.link 
                ? `<a href="${c.link}" target="_blank" class="btn">Garantir Vaga <i data-lucide="external-link" class="icon-sm"></i></a>`
                : `<span class="btn btn-disabled">Inscrições Indisponíveis</span>`;

            html += `
                <div class="card">
                    <div class="card-header">
                        <h3>${c.nome}</h3>
                        <span class="badge ${badgeClass}">${c.status}</span>
                    </div>
                    <div class="card-info">
                        <div class="info-line">
                            <i data-lucide="calendar" class="icon"></i>
                            <span>${c.data} às ${c.horario}</span>
                        </div>
                        <div class="info-line">
                            <i data-lucide="map-pin" class="icon"></i>
                            <span>${c.local}</span>
                        </div>
                        <div class="info-line">
                            <i data-lucide="ruler" class="icon"></i>
                            <span>${c.distancia}</span>
                        </div>
                    </div>
                    ${btnHtml}
                </div>
            `;
        });
        return html + '</div>';
    }
};

// --- NAVEGAÇÃO ---

async function navigate() {
    const app = document.getElementById('app');
    const hash = window.location.hash || '#home';
    
    app.innerHTML = '<div style="text-align:center; padding: 3rem;"><p>Carregando...</p></div>';
    
    try {
        const content = await (routes[hash] || routes['#home'])();
        app.innerHTML = content;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        app.innerHTML = '<p style="text-align:center;">Erro ao carregar o conteúdo.</p>';
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);