/**
 * Decodes contact types bitfield to an array of strings
 * 
 * 0x0001 => ['1']  
 * 0x0101 => ['1','4']
 *   
 * @param type_bitfield 
 * @returns 
 */
function contactTypesToStrs(type_bitfield: number) : string[] {
    const typesStr: string[] = []
    let bits = 0x0001
    
    for (let n = 0 ; n < 8 ; n++) {
        
        if (type_bitfield & bits)
            typesStr.push(bits.toString())
        bits = bits << 1
    }
    return typesStr
}

function contactTypesToNumbers(type_bitfield: number) : number[] {
    const typesNumbers: number[] = []
    let bits = 0x0001
    
    for (let n = 0 ; n < 8 ; n++) {
        
        if (type_bitfield & bits)
            typesNumbers.push(bits)
        bits = bits << 1
    }
    return typesNumbers
}
/**
 *  Encodes contact types bitfield from a string array
 * 
 * ['1','4'] => 0x0101  
 * 
 * @param strs 
 * @returns number bitfield
 */
function strsTocontactTypes(strs: string[]) : number {
    let types: number = 0
    strs.forEach((v) => {
        types += parseInt(v)
    })
    return types
}

function numbersTocontactTypes(numbers: number[]) : number {
    let types: number = 0
    numbers.forEach((v: number) => {
        types += v
    })
    return types
}

export {
    contactTypesToStrs,
    contactTypesToNumbers,
    strsTocontactTypes,
    numbersTocontactTypes
}

