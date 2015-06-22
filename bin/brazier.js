#!/usr/bin/env node
'use strict';

var program = require('commander'),
  pkg = require('../package.json');

program
.version(pkg.version)
.command('get <source>', 'Send JSON from Firebase location to standard output.')
.command('copy <source> <target>', 'Copy data from one Firebase path to another.')
.command('move <source> <target>', 'Move data from one Firebase path to another.')
.command('set <source> [data...]', 'Set Firebase path to JSON data on standard input.')
.parse(process.argv);
