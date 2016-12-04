$().ready(function () {
    new App();
});
var App = (function () {
    function App() {
        var _this = this;
        var query = "\n\t\t\tSELECT ?item ?itemLabel {\n\t\t\t\t?item wdt:P31 wd:Q728937.\n\t\t\t\t?item wdt:P17 wd:Q183\n\t\t\t\tSERVICE wikibase:label {\n\t\t\t\t\tbd:serviceParam wikibase:language \"de\", \"en\" .\n\t\t\t\t}\n\t\t\t}\n\t\t";
        var url = "https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=" + encodeURI(query);
        $.get(url, function (res) {
            var items = [];
            res['results']['bindings'].forEach(function (qitem) {
                var qid = qitem['item']['value'].split('/').slice(-1)[0];
                var label = qitem['itemLabel']['value'];
                items.push({ id: qid, label: label });
            });
            _this.renderLines(items);
        });
        $('#stationList').hide();
    }
    App.prototype.renderLines = function (items) {
        var _this = this;
        items.forEach(function (item) {
            var listitem = $('<li>').html(item['label']);
            listitem.click(function () { _this.loadStations(item['id']); });
            $('#lineList').append(listitem);
        });
    };
    App.prototype.loadStations = function (itemID) {
        var _this = this;
        var query = "\n\t\tSELECT ?item ?itemLabel ?image {\n\t\t\t?item wdt:P81 wd:" + itemID + ".\n\t\t\tOPTIONAL {?item wdt:P18 ?image}\n\t\t\tSERVICE wikibase:label {\n\t\t\t\tbd:serviceParam wikibase:language \"de\", \"en\".\n\t\t\t}\n\t\t}";
        var url = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=' + encodeURI(query);
        $.get(url, function (res) {
            var items = [];
            res['results']['bindings'].forEach(function (qitem) {
                var label = qitem['itemLabel']['value'];
                var image = qitem['image'] ? qitem['image']['value'] : "https://upload.wikimedia.org/wikipedia/commons/a/a5/Camera-photo_Upload-240px.png";
                items.push({ image: image, label: label });
            });
            _this.renderStations(items);
        });
    };
    App.prototype.renderStations = function (items) {
        var _this = this;
        $('#stationList').html('');
        if (items.lenght == 0) {
            $('#stationList').html('no items found');
        }
        $('#stationList').show();
        items.forEach(function (item) {
            var listitem = $('<li>').html("<img src='" + item['image'] + "?width=400' class='stationImage' /><p class='stationTitle'>" + item['label'] + "</p>");
            $('#stationList').append(listitem);
        });
        var closebutton = $('<p id="closeButton">close</p>');
        closebutton.click(function () { _this.closeOverlay(); });
        $('#stationList').append(closebutton);
    };
    App.prototype.closeOverlay = function () {
        $('#stationList').hide();
    };
    return App;
}());
//# sourceMappingURL=app.js.map