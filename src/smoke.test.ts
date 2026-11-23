describe('jest infrastructure', () => {
  it('runs in jsdom with jest-dom matchers', () => {
    document.body.innerHTML = '<span data-testid="probe">ok</span>';
    expect(document.querySelector('[data-testid="probe"]')).toBeInTheDocument();
  });
});
