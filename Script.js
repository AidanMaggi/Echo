// RSS feed URLs (using rss2json API to convert RSS to JSON)
const rssFeeds = {
    'middle-east': [
        'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
        'https://api.rss2json.com/v1/api.json?rss_url=https://rss.cnn.com/rss/cnn_world.rss'
    ],
    'asia': [
        'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/asia/rss.xml',
        'https://api.rss2json.com/v1/api.json?rss_url=https://rss.cnn.com/rss/cnn_world.rss'
    ],
    'americas': [
        'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.foxnews.com/foxnews/national',
        'https://api.rss2json.com/v1/api.json?rss_url=https://www.cbsnews.com/latest/rss/us'
    ]
};

// Keyword filters for topics
const filters = {
    'war': ['war', 'conflict', 'military', 'battle'],
    'politics': ['politics', 'government', 'election', 'policy'],
    'religion': ['religion', 'faith', 'church', 'mosque']
};

let currentTab = 'middle-east';
let currentFilter = 'all';
let allNews = {};

// Fetch news for each tab
function fetchNews() {
    Object.keys(rssFeeds).forEach(tab => {
        allNews[tab] = [];
        rssFeeds[tab].forEach(url => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    data.items.forEach(item => {
                        allNews[tab].push({
                            title: item.title,
                            link: item.link,
                            description: item.description
                        });
                    });
                    if (tab === currentTab) displayNews();
                })
                .catch(error => console.error('Error fetching news:', error));
        });
    });
}

// Display news based on current tab and filter
function displayNews() {
    const container = document.getElementById(`${currentTab}-news`);
    container.innerHTML = '';
    let newsItems = allNews[currentTab] || [];

    if (currentFilter !== 'all') {
        newsItems = newsItems.filter(item => {
            const text = (item.title + ' ' + item.description).toLowerCase();
            return filters[currentFilter].some(keyword => text.includes(keyword));
        });
    }

    newsItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a><p>${item.description}</p>`;
        container.appendChild(div);
    });
}

// Tab switching
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');
    currentTab = tabName;
    displayNews();
}

// Filter news
function filterNews(filter) {
    currentFilter = filter;
    displayNews();
}

// Load news on page start
fetchNews();
