export const requiredRuleUtil = (description: string) => {
    const ruleObj: { required: boolean; message?: string } = { required: true }
    return description ? [{ ...ruleObj, message: `请输入${description}` }] : [ruleObj]
}
