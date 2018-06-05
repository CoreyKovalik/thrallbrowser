'use strict';

describe('Filter: isCharacterOnline', function() {
  let isCharacterOnline;

  beforeEach(module('thrallbrowser'));

  beforeEach(inject(function ($filter) {
    isCharacterOnline = $filter('isCharacterOnline');
  }));

  it('should handle "Online Now"', function () {
    let character = {
      is_online: true,
      last_online: 0
    };
    expect(isCharacterOnline(character)).toBe('Online Now');
  });

  it('should handle last online', function () {
    let character = {
      is_online: false,
      // isCharacterOnline second timestamps, not millisecond
      last_online: (Date.now() / 1000) - 1
    };
    expect(isCharacterOnline(character)).toBe('a few seconds ago');
  });
});
