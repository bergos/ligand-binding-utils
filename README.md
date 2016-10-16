# ligand-binding-utils

Utils to import and process ligand binding data.

## csv-parser-stream

Very simple CSV parser.
Expects each line as new chunk (one `data` event per line).
The `byline` package can be used for preprocessing.

## filestream-or-stream

Returns a filestream if a filename is given otherwise the given stream.
Useful for command line processing to choose between file or stdin input.

## filter-stream

A stream transform to filter objects.

## from-file-or-stream

Returns the contents of the given file.
If no filename was given, the stream will be used.
Useful for command line processing to choose between file or stdin input.

## object-to-triple-stream

A stream transform to convert objects to RDF-Ext triples.
Simple property to predicate and callback mappings are supported.

## rdf-serializer-ntriples

Converts a stream for RDF-Ext triples to a string N-Triples stream.
