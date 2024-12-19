document.addEventListener('DOMContentLoaded', function() {
    const pageInfo = {
        terms: { xmlFile: '/BackEnd/data/terms.xml', pageTitle: '이용약관' },
        privacy: { xmlFile: '/BackEnd/data/privacyPolicy.xml', pageTitle: '개인정보취급방침' },
        pricing: { xmlFile: '/BackEnd/data/pricing.xml', pageTitle: '비급여수가표' },
        about: { xmlFile: '/BackEnd/data/about.xml', pageTitle: '병원 소개' }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'about';


    const currentPage = pageInfo[page] || pageInfo.about;

    document.getElementById('page-title').textContent = currentPage.pageTitle;

    fetch(currentPage.xmlFile)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const content = data.querySelector('content').textContent;
            document.getElementById('terms-content').innerHTML = content;
        })
        .catch(error => console.error('Error fetching content:', error));
});
