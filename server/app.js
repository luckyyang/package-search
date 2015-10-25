SearchSource.defineSource('packages', function(searchText, options) {
  // simply do the query and return the result
  var query = {
    "multi_match": {
      "query": searchText,
      "type": "most_fields",
      "fields": ["packageName", "description"]
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
    source._id = doc._id;
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
