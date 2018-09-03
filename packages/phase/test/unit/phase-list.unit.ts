// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-phase
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {PhaseList, Phase, Context} from '../..';
import {expect} from '@loopback/testlab';

describe('PhaseList', () => {
  let phaseList: PhaseList;

  beforeEach(function createEmptyPhaseList() {
    phaseList = new PhaseList();
  });

  describe('phaseList.find(phaseName)', () => {
    it('should find a phase by phaseName', () => {
      const phase = phaseList.add('test');
      expect(phase).to.eql(phaseList.find('test'));
    });
  });

  describe('phaseList.findOrAdd(phaseName)', () => {
    it('should always return a phase', () => {
      const randomKey = Math.random().toString();
      const phase = phaseList.findOrAdd(randomKey);
      expect(phase.id).to.equal(randomKey);
    });
  });

  describe('phaseList.add(phaseName)', () => {
    it('should add a phase to the list', () => {
      const phase = new Phase('myPhase');
      phaseList.add(phase);
      const result = phaseList.find('myPhase');
      expect(result).to.equal(phase);
    });
    it('should create a phase and add it to the list', () => {
      phaseList.add('myPhase');
      const result = phaseList.find('myPhase');
      expect(result.id).to.equal('myPhase');
    });
    it('should create and add an array oh phases', () => {
      phaseList.add('foo', 'bar');
      const foo = phaseList.find('foo');
      const bar = phaseList.find('bar');
      expect(foo.id).to.equal('foo');
      expect(bar.id).to.equal('bar');
    });

    it('should throw when adding an existing phase', () => {
      phaseList.add('a-name');
      expect(() => {
        phaseList.add('a-name');
      }).to.throw(/a-name/);
    });
  });

  describe('phaseList.remove(phaseName)', () => {
    it('should remove a phase from the list', () => {
      const phase = new Phase('myPhase');
      phaseList.add(phase);
      const result = phaseList.find('myPhase');
      expect(result).to.equal(phase);
      phaseList.remove(phase.id);
      expect(phaseList.find('myPhase')).to.equal(null);
    });

    it('should not remove any phase if phase is not in the list', () => {
      const phase = new Phase('myPhase');
      phaseList.add('bar');
      const result = phaseList.find('myPhase');
      expect(result).to.equal(null);
      const removed = phaseList.remove(phase.id);
      expect(removed).to.equal(null);
      expect(phaseList.getPhaseNames()).to.eql(['bar']);
    });
  });

  describe('phases.toArray()', () => {
    it('should return the list of phases as an array', () => {
      const names = ['a', 'b'];

      phaseList.add(...names);

      const result = phaseList.toArray().map(function(phase) {
        return phase.id;
      });

      expect(names).to.eql(result);
    });
  });

  describe('phaseList.run(ctx, cb)', () => {
    it('runs phases in the correct order', async () => {
      const called: string[] = [];

      phaseList.add('one', 'two');

      phaseList.find('one').use(async ctx => {
        expect(ctx.hello).to.equal('world');
        return new Promise<void>(resolve => {
          setTimeout(() => {
            called.push('one');
            resolve();
          }, 1);
        });
      });

      phaseList.find('two').use(async ctx => {
        called.push('two');
      });

      await phaseList.run({hello: 'world'});
      expect(called).to.eql(['one', 'two']);
    });
  });

  describe('phaseList.getPhaseNames()', () => {});

  describe('phaseList.addAt', () => {
    it('adds the phase at an expected index', () => {
      phaseList.add('start', 'end');
      phaseList.addAt(1, 'middle');
      expect(phaseList.getPhaseNames()).to.eql(['start', 'middle', 'end']);
    });
  });

  describe('phaseList.addAfter', () => {
    it('adds the phase at an expected position', () => {
      phaseList.add('start', 'end');
      phaseList.addAfter('start', 'middle');
      phaseList.addAfter('end', 'last');
      expect(phaseList.getPhaseNames()).to.eql([
        'start',
        'middle',
        'end',
        'last',
      ]);
    });

    it('throws when the "after" phase was not found', () => {
      expect(() => {
        phaseList.addAfter('unknown-phase', 'a-name');
      }).to.throw(/unknown phase/i);
    });
  });

  describe('phaseList.addBefore', () => {
    it('adds the phase at an expected position', () => {
      phaseList.add('start', 'end');
      phaseList.addBefore('start', 'first');
      phaseList.addBefore('end', 'middle');
      expect(phaseList.getPhaseNames()).to.eql([
        'first',
        'start',
        'middle',
        'end',
      ]);
    });

    it('throws when the "before" phase was not found', () => {
      expect(() => {
        phaseList.addBefore('unknown-phase', 'a-name');
      }).to.throw(/unknown-phase/);
    });
  });

  describe('phaseList.zipMerge(phases)', () => {
    it('merges phases preserving the order', () => {
      phaseList.add('initial', 'session', 'auth', 'routes', 'files', 'final');
      phaseList.zipMerge([
        'initial',
        'postinit',
        'preauth', // add
        'auth',
        'routes',
        'subapps', // add
        'final',
        'last', // add
      ]);

      expect(phaseList.getPhaseNames()).to.eql([
        'initial',
        'postinit',
        'preauth', // new
        'session',
        'auth',
        'routes',
        'subapps', // new
        'files',
        'final',
        'last', // new
      ]);
    });

    it('starts adding phases from the start', () => {
      phaseList.add('start', 'end');
      phaseList.zipMerge(['first', 'end', 'last']);
      expect(phaseList.getPhaseNames()).to.eql([
        'first',
        'start',
        'end',
        'last',
      ]);
    });
  });

  describe('phaseList.registerHandler', () => {
    const NOOP_HANDLER = async (ctx: Context) => {};

    it('adds handler to the correct phase', () => {
      phaseList.add('one', 'two');
      phaseList.registerHandler('one', NOOP_HANDLER);
      expect(phaseList.find('one').handlers).to.eql([NOOP_HANDLER]);
    });

    it('supports ":before" suffix', () => {
      phaseList.add('main');
      phaseList.registerHandler('main:before', NOOP_HANDLER);
      expect(phaseList.find('main').beforeHandlers).to.eql([NOOP_HANDLER]);
    });

    it('supports ":after" suffix', () => {
      phaseList.add('main');
      phaseList.registerHandler('main:after', NOOP_HANDLER);
      expect(phaseList.find('main').afterHandlers).to.eql([NOOP_HANDLER]);
    });
  });
});