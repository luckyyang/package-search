SearchSource.defineSource('packages', function(searchText, options) {
  // simply do the query and return the result
  Meteor._sleepForMs(1000);
  var words = searchText.trim().split(" ");
  var lastWord = words[words.length -1];
  var query = {
    "bool": {
      "must": [
        {
          "bool": {
            "should": [
              {"match": {"packageName": {"query": searchText}}},
              {"prefix": {"packageName": lastWord}},
              {"match": {"description": {"query": searchText}}},
              {"prefix": {"description": lastWord}}
            ]
          }
        }
      ],
      "should": [
        {"match_phrase_prefix": {"packageName": {"query": searchText, slop: 5}}},
        {"match_phrase_prefix": {"description": {"query": searchText, slop: 5}}},
      ]
    }
  };

  var result =  EsClient.search({
    index: "meteor",
    type: "packages",
    body: {
      query: query
    }
  });

  var data = result.hits.hits.map(function(doc) {
    var source = _.clone(doc._source);
    source._score = doc._score;
    return source;
  });

  // getting the metadata
  var metadata = {
    total: result.hits.total,
    took: result.took
  };

  // return both data and metadata
  return {
    data: data,
    metadata: metadata
  };
});
