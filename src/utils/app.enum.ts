export enum StatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    LOCKED = 'LOCKED',
}

export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHERS = 'OTHERS'
}

export enum ProductEnum {
    AVAILABLE = 'AVAILABLE',
    OUT_OF_ORDER = 'OUT_OF_ORDER',
    DELETED = 'DELETED',
}

export enum OrderStatusEnum {
    CHECKING = 'CHECKING',
    CONFIRMED = 'CONFIRMED',
    DELIVERING = 'DELIVERING',
    DONE = 'DONE',
}

export enum StatusReportEnum {
    CONATAIN_SENSITIVE_INFO = 'CONATAIN_SENSITIVE_INFO',
    SCAM = 'SCAM',
    INACCURATE_MISLEADING = 'INACCURATE_MISLEADING',
    OTHER_REASON = 'OTHER_REASON'
}
export enum OtpEnum {
    FORGET = 'FORGET',
    VERIFICATION = 'VERIFICATION',
  }
