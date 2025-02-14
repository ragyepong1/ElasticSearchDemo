﻿$(function () {

    $("select").change(function () { $("form#search-criteria").submit(); });
    $("input[type='checkbox']").change(function () { $("form#search-criteria").submit(); });
    $(".timeago").timeago();

    setupTypeAhead();

    function setupTypeAhead() {
        var typeAheadOptions = {
            hint: true,
            highlight: true,
            minLength: 1
        };

        var remoteHandler = function (query, process) {
            return $.ajax(
                {
                    cache: false,
                    type: "POST",
                    url: "/suggest",
                    data: JSON.stringify({ Query: query }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                .success(function (suggestions) { process(suggestions); });
        };

        $('#query').typeahead(typeAheadOptions,
            {
                displayKey: "title",
                templates: {
                    empty: [
                        '<div class="lead">',
                        'no suggestions found for current prefix',
                        '</div>'
                    ].join('\n'),
                    suggestion: function (suggestion) {
                        return [
                            '<h4 class="text-primary">',
                            suggestion.title,
                            '<span class="text-humble pull-right">',
                            suggestion.rating + " score",
                            '</span>',
                            '</h5>',
                            '<h5 class="text-primary">',
                            suggestion.summary,
                            '</h6>'
                        ].join('\n');
                    }
                },
                source: remoteHandler
            }
        ).on('typeahead:selected', function (e, o) {
            var queryStyledTitle = o.title.replace(" ", "+");
            window.location.href = "https://www.google.com/search?q=" + queryStyledTitle;
        })
            .on('typeahead:selected', function (e, o) {
                $("#query").focus().select();
            });
    }

    $("#query").focus().select();

});


