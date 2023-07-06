var crimeData = [];
var fireData = [];

Promise.all([
    fetch('CrimeMap_geocoded.json').then(response => response.json()),
    fetch('https://smartcity.tacc.utexas.edu/FireIncident/data/2022-08-08-FireMap.json').then(response => response.json())
]).then(([crimeResponse, fireResponse]) => {
    crimeData = crimeResponse;
    fireData = fireResponse.rss.channel.item;

    const events = [...crimeData, ...fireData].sort((a, b) => new Date(b.report_date_time || b.pubDate) - new Date(a.report_date_time || a.pubDate));

    events.forEach((event, index) => {
        let listItem, summary, details, dateString;
        
        if (event.report_date_time) {
            // This is a crime event
            dateString = new Date(event.report_date_time).toLocaleString();
            summary = `${event.offenses.join(', ')}`;
            details = `
                Report Date: ${dateString}<br>
                Location: ${event.offense_location.join(', ')}<br>
                Crime: ${event.report_number}
            `;
        } else {
            // This is a fire event
            dateString = new Date(event.pubDate).toLocaleString();
            summary = event.title;
            details = `
                Location: ${event.description.split('|')[0]}<br>
                Publish Date: ${dateString}
            `;
        }

        listItem = `
            <div class="card">
                <div class="card-header" id="heading${index}">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                            ${summary}
                        </button>
                    </h2>
                </div>

                <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#eventsAccordion">
                    <div class="card-body">
                        ${details}
                    </div>
                </div>
            </div>
        `;

        $('#eventsAccordion').append(listItem);
    });
}).then(() => {
    // Open the sidebar once the data has been fetched and sorted
    $('#sidebar').addClass('open');
});
