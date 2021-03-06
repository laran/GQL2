/* globals describe, it */
var gql = require('../src/lexer');

describe('Lexer', function () {
    var lexicalError = /^Query Error: unrecognized text/;

    describe('Symbols', function () {
        it('can recognise !', function () {
            gql.lex('!asd').should.eql([{token: 'NOT', matched: '!'},{token: 'LITERAL', matched: 'asd'}]);
        });
        it('can recognise !p:', function () {
            gql.lex('!p:').should.eql([{token: 'NOTPROP', matched: '!p:'}]);
        });
        it('can recognise +', function () {
            gql.lex('+').should.eql([{token: 'AND', matched: '+'}]);
        });
        it('can recognise ,', function () {
            gql.lex(',').should.eql([{token: 'OR', matched: ','}]);
        });
        it('can recognise [ out of context as a literal', function () {
            gql.lex('[').should.eql([{token: 'LITERAL', matched: '['}]);
        });
        it('can recognise ] out of context as a literal', function () {
            gql.lex(']').should.eql([{token: 'LITERAL', matched: ']'}]);
        });
        it('can recognise (', function () {
            gql.lex('(').should.eql([{token: 'LPAREN', matched: '('}]);
        });
        it('can recognise (', function () {
            gql.lex('(').should.eql([{token: 'LPAREN', matched: '('}]);
        });
        it('can recognise !(', function () {
            gql.lex('!(').should.eql([{token: 'NOT', matched: '!'}, {token: 'LPAREN', matched: '('}]);
        });
        it('can recognise )', function () {
            gql.lex(')').should.eql([{token: 'RPAREN', matched: ')'}]);
        });
        it('can recognise >', function () {
            gql.lex('>').should.eql([{token: 'GT', matched: '>'}]);
        });
        it('can recognise <', function () {
            gql.lex('<').should.eql([{token: 'LT', matched: '<'}]);
        });
        it('can recognise >=', function () {
            gql.lex('>=').should.eql([{token: 'GTE', matched: '>='}]);
        });
        it('can recognise <=', function () {
            gql.lex('<=').should.eql([{token: 'LTE', matched: '<='}]);
        });
    });

    describe('VALUES', function () {
        it('can recognise null', function () {
            gql.lex('null').should.eql([{token: 'NULL', matched: 'null'}]);
        });

        it('can recognise a LITERAL', function () {
            gql.lex('six').should.eql([{token: 'LITERAL', matched: 'six'}]);
        });

        it('can recognise a STRING', function () {
            gql.lex('\'six\'').should.eql([{token: 'STRING', matched: '\'six\''}]);
        });

        it('can recognise a LITERAL that\'s a number', function () {
            gql.lex('6').should.eql([{token: 'LITERAL', matched: '6'}]);
        });

        it('does not confuse values in LITERALs', function () {
            gql.lex('strueth').should.eql([{token: 'LITERAL', matched: 'strueth'}]);
            gql.lex('trueth').should.eql([{token: 'LITERAL', matched: 'trueth'}]);
            gql.lex('true_thing').should.eql([{token: 'LITERAL', matched: 'true_thing'}]);
            gql.lex('true-thing').should.eql([{token: 'LITERAL', matched: 'true-thing'}]);
        });

        it('does not confuse values in STRINGs', function () {
            gql.lex('\'strueth\'').should.eql([{token: 'STRING', matched: '\'strueth\''}]);
            gql.lex('\'trueth\'').should.eql([{token: 'STRING', matched: '\'trueth\''}]);
            gql.lex('\'true_thing\'').should.eql([{token: 'STRING', matched: '\'true_thing\''}]);
            gql.lex('\'true-thing\'').should.eql([{token: 'STRING', matched: '\'true-thing\''}]);
        });
    });

    describe('LITERAL values', function () {
        it('should match literals', function () {
            gql.lex('myvalue').should.eql([
                {token: 'LITERAL', matched: 'myvalue'}
            ]);
            gql.lex('my value').should.eql([
                {token: 'LITERAL', matched: 'my value'}
            ]);
            gql.lex('my-value').should.eql([
                {token: 'LITERAL', matched: 'my-value'}
            ]);
            gql.lex('my&value!').should.eql([
                {token: 'LITERAL', matched: 'my&value!'}
            ]);
            gql.lex('my&valu\\\'e!').should.eql([
                {token: 'LITERAL', matched: 'my&valu\\\'e!'}
            ]);
            gql.lex('my&valu\'e!').should.eql([
                {token: 'LITERAL', matched: 'my&valu\'e!'}
            ]);
        });

        it('should separate NOT at beginning of literal', function () {
            gql.lex('!photo!graph').should.eql([
                {token: 'NOT', matched: '!'},
                {token: 'LITERAL', matched: 'photo!graph'}
            ]);
        });

        it('should not match special chars at the start of a literal', function () {
            gql.lex('+test').should.eql([
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex(',test').should.eql([
                {token: 'OR', matched: ','},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex('(test').should.eql([
                {token: 'LPAREN', matched: '('},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex(')test').should.eql([
                {token: 'RPAREN', matched: ')'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex('>test').should.eql([
                {token: 'GT', matched: '>'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex('<test').should.eql([
                {token: 'LT', matched: '<'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex('[test').should.eql([
                {token: 'LITERAL', matched: '[test'}
            ]);
            gql.lex('test]').should.eql([
                {token: 'LITERAL', matched: 'test]'}
            ]);
            gql.lex('[test]').should.eql([
                {token: 'IN', matched: '[test]'}
            ]);
            gql.lex(']test').should.eql([
                {token: 'LITERAL', matched: ']test'}
            ]);
            gql.lex('>=test').should.eql([
                {token: 'GTE', matched: '>='},
                {token: 'LITERAL', matched: 'test'}
            ]);
            gql.lex('<=test').should.eql([
                {token: 'LTE', matched: '<='},
                {token: 'LITERAL', matched: 'test'}
            ]);

            (function () { gql.lex('=test');}).should.not.throw(lexicalError);
            (function () { gql.lex('"test');}).should.not.throw(lexicalError);
            (function () { gql.lex('\'test');}).should.not.throw(lexicalError);
        });

        it('should not match special chars at the end of a literal', function () {
            gql.lex('test+').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'AND', matched: '+'}
            ]);
            gql.lex('test,').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'OR', matched: ','}
            ]);
            gql.lex('test(').should.eql([
                {token: 'LITERAL', matched: 'test('}
            ]);
            gql.lex('test)').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'RPAREN', matched: ')'}
            ]);
            gql.lex('test\\)').should.eql([
                {token: 'LITERAL', matched: 'test\\)'}
            ]);
            gql.lex('test>').should.eql([
                {token: 'LITERAL', matched: 'test>'}
            ]);
            gql.lex('test<').should.eql([
                {token: 'LITERAL', matched: 'test<'}
            ]);
            gql.lex('test[').should.eql([
                {token: 'LITERAL', matched: 'test['}
            ]);
            gql.lex('test]').should.eql([
                {token: 'LITERAL', matched: 'test]'}
            ]);
            gql.lex('test>=').should.eql([
                {token: 'LITERAL', matched: 'test>='}
            ]);
            gql.lex('test<=').should.eql([
                {token: 'LITERAL', matched: 'test<='}
            ]);
            (function () { gql.lex('test=');}).should.not.throw(lexicalError);
            (function () { gql.lex('test"');}).should.not.throw(lexicalError);
            (function () { gql.lex('test\'');}).should.not.throw(lexicalError);
        });

        it('should permit escaped special chars inside a literal', function () {
            gql.lex('t\\+st').should.eql([{token: 'LITERAL', matched: 't\\+st'}]);
            gql.lex('t\\,st').should.eql([{token: 'LITERAL', matched: 't\\,st'}]);
            gql.lex('t\\(st').should.eql([{token: 'LITERAL', matched: 't\\(st'}]);
            gql.lex('t\\)st').should.eql([{token: 'LITERAL', matched: 't\\)st'}]);
            gql.lex('t\\>st').should.eql([{token: 'LITERAL', matched: 't\\>st'}]);
            gql.lex('t\\<st').should.eql([{token: 'LITERAL', matched: 't\\<st'}]);
            gql.lex('t\\=st').should.eql([{token: 'LITERAL', matched: 't\\=st'}]);
            gql.lex('t\\[st').should.eql([{token: 'LITERAL', matched: 't\\[st'}]);
            gql.lex('t\\]st').should.eql([{token: 'LITERAL', matched: 't\\]st'}]);
            gql.lex('t\\\'st').should.eql([{token: 'LITERAL', matched: 't\\\'st'}]);
            gql.lex('t\\"st').should.eql([{token: 'LITERAL', matched: 't\\"st'}]);
        });
    });

    describe('LITERAL vs PROP', function () {
        it('should match : in string as PROP before, literal after', function () {
            gql.lex(':test').should.eql([
                {token: 'LITERAL', matched: ':test'}
            ]);

            gql.lex('te:st').should.eql([
                {token: 'PROP', matched: 'te:'},
                {token: 'LITERAL', matched: 'st'}
            ]);

            gql.lex('test:').should.eql([
                {token: 'PROP', matched: 'test:'}
            ]);
        });

        it('should only match colon-at-end as PROP if PROP is valPROP', function () {
            gql.lex('te!:st').should.eql([
                {token: 'LITERAL', matched: 'te!:st'}
            ]);
        });
    });

    describe('STRING values', function () {
        it('can recognise simple STRING', function () {
            gql.lex('\'magic\'').should.eql([{token: 'STRING', matched: '\'magic\''}]);
            gql.lex('\'magic mystery\'').should.eql([{token: 'STRING', matched: '\'magic mystery\''}]);
            gql.lex('\'magic 123\'').should.eql([{token: 'STRING', matched: '\'magic 123\''}]);
        });

        it('can recognise multiple STRING values', function () {
            gql.lex('\'magic\'\'mystery\'').should.eql([
                {token: 'STRING', matched: '\'magic\''},
                {token: 'STRING', matched: '\'mystery\''}
            ]);
            gql.lex('\'magic\' \'mystery\'').should.eql([
                {token: 'STRING', matched: '\'magic\''},
                {token: 'STRING', matched: '\'mystery\''}
            ]);
            gql.lex('\'magic\',\'mystery\'').should.eql([
                {token: 'STRING', matched: '\'magic\''},
                {token: 'OR', matched: ','},
                {token: 'STRING', matched: '\'mystery\''}
            ]);
            gql.lex('[\'magic\',\'mystery\']').should.eql([
                {token: 'IN', matched: '[\'magic\',\'mystery\']'}
            ]);
        });

        it('can recognise multiple LITERAL values', function () {
            // same check, but without quotes
            gql.lex('[magic,mystery]').should.eql([
                {token: 'IN', matched: '[magic,mystery]'}
            ]);
            gql.lex('[1,5]').should.eql([
                {token: 'IN', matched: '[1,5]'}
            ]);
            gql.lex('[2015-01-01,2016-01-01]').should.eql([
                {token: 'IN', matched: '[2015-01-01,2016-01-01]'}
            ]);
            // same check, with whitespace
            gql.lex('[ 2015-01-01, 2016-01-01 ]').should.eql([
                {token: 'IN', matched: '[ 2015-01-01, 2016-01-01 ]'}
            ]);
        });

        it('can recognise STRING with special characters', function () {
            gql.lex('\'magic+\'').should.eql([{token: 'STRING', matched: '\'magic+\''}]);
            gql.lex('\'magic,\'').should.eql([{token: 'STRING', matched: '\'magic,\''}]);
            gql.lex('\'magic-\'').should.eql([{token: 'STRING', matched: '\'magic-\''}]);
            gql.lex('\'magic>\'').should.eql([{token: 'STRING', matched: '\'magic>\''}]);
            gql.lex('\'magic<\'').should.eql([{token: 'STRING', matched: '\'magic<\''}]);
        });

        it('should permit special chars inside a STRING and properly interpret quotes', function () {
            gql.lex('\'t+st\'').should.eql([{token: 'STRING', matched: '\'t+st\''}]);
            gql.lex('\'t,st\'').should.eql([{token: 'STRING', matched: '\'t,st\''}]);
            gql.lex('\'t(st\'').should.eql([{token: 'STRING', matched: '\'t(st\''}]);
            gql.lex('\'t)st\'').should.eql([{token: 'STRING', matched: '\'t)st\''}]);
            gql.lex('\'t>st\'').should.eql([{token: 'STRING', matched: '\'t>st\''}]);
            gql.lex('\'t<st\'').should.eql([{token: 'STRING', matched: '\'t<st\''}]);
            gql.lex('\'t=st\'').should.eql([{token: 'STRING', matched: '\'t=st\''}]);
            gql.lex('\'t[st\'').should.eql([{token: 'STRING', matched: '\'t[st\''}]);
            gql.lex('\'t]st\'').should.eql([{token: 'STRING', matched: '\'t]st\''}]);
            gql.lex('\'t\'st\'').should.eql([
                {token: 'STRING', matched: '\'t\''},
                {token: 'LITERAL', matched: 'st\''}
            ]);
            gql.lex('\'t"st\'').should.eql([
                {token: 'STRING', matched: '\'t"st\''}
            ]);
        });

        it('should permit escaped quotes inside a String', function () {
            gql.lex('\'t\\\'st\'').should.eql([{token: 'STRING', matched: '\'t\\\'st\''}]);
            gql.lex('\'t\\"st\'').should.eql([{token: 'STRING', matched: '\'t\\"st\''}]);
        });
    });

    describe('single & double QUOTE marks', function () {
        it('CAN match an escaped and unescaped double quotes in a LITERAL', function () {
            gql.lex('thing\\"amabob').should.eql([{token: 'LITERAL', matched: 'thing\\"amabob'}]);
            gql.lex('thing"amabob').should.eql([{token: 'LITERAL', matched: 'thing"amabob'}]);
        });
        it('CAN match an escaped single quote in a LITERAL', function () {
            gql.lex('thing\\\'amabob').should.eql([{token: 'LITERAL', matched: 'thing\\\'amabob'}]);
            gql.lex('thing\'amabob').should.eql([{token: 'LITERAL', matched: 'thing\'amabob'}]);
        });
        it('CAN match an escaped or unescaped double quote in a STRING', function () {
            gql.lex('\'thing\\"amabob\'').should.eql([{token: 'STRING', matched: '\'thing\\"amabob\''}]);
            gql.lex('\'thing"amabob\'').should.eql([{token: 'STRING', matched: '\'thing"amabob\''}]);
        });
        it('CAN match an escaped single quote in a STRING', function () {
            gql.lex('\'thing\\\'amabob\'').should.eql([{token: 'STRING', matched: '\'thing\\\'amabob\''}]);
            gql.lex('\'thing\'amabob\'').should.eql([
                {token: 'STRING', matched: '\'thing\''},
                {token: 'LITERAL', matched: 'amabob\''}
            ]);
        });
    });

    describe('Filter expressions', function () {
        it('should separate NOT at beginning of literal', function () {
            gql.lex('tag:-photo').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: '-photo'}
            ]);

            gql.lex('tag:-photo-graph').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: '-photo-graph'}
            ]);

            gql.lex('tags:[-getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'IN', matched: '[-getting-started]'}
            ]);
        });

        it('should permit \'-\' inside a literal', function () {
            gql.lex('tags:getting-started').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'LITERAL', matched: 'getting-started'}
            ]);

            gql.lex('tags:[getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'IN', matched: '[getting-started]'}
            ]);

            gql.lex('tags:[-getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'IN', matched: '[-getting-started]'}
            ]);

            gql.lex('tags:-[getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'LITERAL', matched: '-[getting-started]'}
            ]);

            gql.lex('id:-1+tags:[getting-started]').should.eql([
                {token: 'PROP', matched: 'id:'},
                {token: 'LITERAL', matched: '-1'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'tags:'},
                {token: 'IN', matched: '[getting-started]'}
            ]);
        });
    });

    describe('complex examples', function () {
        it('many expressions', function () {
            gql.lex('tag:photo+featured:true,$having.tag_count:>=5').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'featured:'},
                {token: 'LITERAL', matched: 'true'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: '$having.tag_count:'},
                {token: 'GTE', matched: '>='},
                {token: 'LITERAL', matched: '5'}
            ]);
        });

        it('in expressions', function () {
            gql.lex('author:-joe+tag:[photo,video]').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'LITERAL', matched: '-joe'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'tag:'},
                {token: 'IN', matched: '[photo,video]'}
            ]);
        });
    });
});
