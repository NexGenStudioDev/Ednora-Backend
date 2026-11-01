import { validateCreateNotice } from '../notice.validator.mjs';

describe('Notice Zod Validation Suite', () => {
  it('should accept valid notice payload', () => {
    const payload = {
      title: 'Annual Sports Meet 2026',
      content: 'All sports team registrations must be completed by Friday evening.',
      type: 'Event',
      target: 'All Students',
      priority: 'high',
      doc_link: 'https://res.cloudinary.com/demo/image/upload/sports.pdf',
    };

    const validated = validateCreateNotice(payload);
    expect(validated.title).toBe('Annual Sports Meet 2026');
    expect(validated.content).toBe('All sports team registrations must be completed by Friday evening.');
    expect(validated.type).toBe('Event');
    expect(validated.priority).toBe('high');
    expect(validated.target).toBe('All Students');
  });

  it('should support alternate noticeContent property', () => {
    const payload = {
      title: 'Campus Maintenance Window',
      noticeContent: 'Internet server maintenance scheduled for midnight.',
      type: 'Announcement',
    };

    const validated = validateCreateNotice(payload);
    expect(validated.content).toBe('Internet server maintenance scheduled for midnight.');
    expect(validated.priority).toBe('normal');
  });

  it('should reject titles shorter than 3 characters', () => {
    expect(() => {
      validateCreateNotice({
        title: 'AB',
        content: 'Valid content exceeding minimum character constraint.',
      });
    }).toThrow(/Title must be at least 3 characters/);
  });

  it('should reject content shorter than 5 characters', () => {
    expect(() => {
      validateCreateNotice({
        title: 'Valid Notice Title',
        content: 'Hi',
      });
    }).toThrow(/Notice content must be at least 5 characters/);
  });

  it('should reject invalid priority values', () => {
    expect(() => {
      validateCreateNotice({
        title: 'Valid Notice Title',
        content: 'Valid content description for testing.',
        priority: 'super-urgent-now',
      });
    }).toThrow(/Priority must be urgent, high, normal, or low/);
  });
});

