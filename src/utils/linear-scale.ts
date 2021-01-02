class LinearScale {
  private static readonly DOMAIN_NOT_SPECIFIED = "Domain is not specified!";
  private static readonly RANGE_NOT_SPECIFIED = "Range is not specified!";

  public domain?: [number, number];
  public range?: [number, number];

  private get domainToRangeScale() {
    if (this.domain == null) throw LinearScale.DOMAIN_NOT_SPECIFIED;
    if (this.range == null) throw LinearScale.RANGE_NOT_SPECIFIED;

    return (this.range[1] - this.range[0]) / (this.domain[1] - this.domain[0]);
  }

  domainToRange(value: number) {
    if (this.domain == null) throw LinearScale.DOMAIN_NOT_SPECIFIED;
    if (this.range == null) throw LinearScale.RANGE_NOT_SPECIFIED;

    return (value - this.domain[0]) * this.domainToRangeScale + this.range[0];
  }
}

export default LinearScale;
